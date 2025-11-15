import { createFilter } from "vite";
import * as vite from "vite";
// @ts-expect-error no types
import { esbuildFlowPlugin, flowPlugin } from "@bunchtogether/vite-plugin-flow";
import commonjs from "vite-plugin-commonjs";
import type { Plugin } from "vite";
import { makeIdFiltersToMatchWithQuery } from "@rolldown/pluginutils";
import { transformReanimatedWebUtilsWithMap } from "./transforms";
import react, { type Options } from "@vitejs/plugin-react";

const extensions = [
  ".web.mjs",
  ".web.js",
  ".web.mts",
  ".web.ts",
  ".web.tsx",
  ".web.cjs",
  ".mjs",
  ".js",
  ".jsx",
  ".json",
  ".mts",
  ".ts",
  ".tsx",
  ".cjs",
];

const defaultIncludeRE = /\.[tj]sx?$/;
const defaultExcludeRE =
  /\/node_modules\/(?!react-native|@react-native|expo|@expo)/;

export type RnwOptions = Options;

const getJsxOption = (jsxRuntime: Options["jsxRuntime"]) => {
  const jsxOptionMapping = {
    automatic: "automatic",
    classic: "transform",
  } as const;

  const jsxOption =
    jsxRuntime && jsxRuntime in jsxOptionMapping
      ? jsxOptionMapping[jsxRuntime]
      : "automatic";
  return jsxOption;
};

export function rnw(opts: RnwOptions = {}): Plugin[] {
  const include = opts.include ?? defaultIncludeRE;
  const exclude = opts.exclude ?? defaultExcludeRE;
  const filter = createFilter(include, exclude);
  let isProduction = true;

  const rnwPlugin: Plugin = {
    name: "vite:react-native-web-babel",
    enforce: "pre",
    config(_userConfig, { mode }) {
      const development = mode === "development";

      return {
        define: {
          global: "window",
          DEV: JSON.stringify(development),
          "global.__x": {},
          _frameTimestamp: undefined,
          _WORKLET: false,
          __DEV__: JSON.stringify(development),
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || mode),
          EXPO_OS: JSON.stringify("web"),
          "process.env.EXPO_OS": JSON.stringify("web"),
          "global.Error": "Error",
        },

        optimizeDeps: {
          esbuildOptions: {
            resolveExtensions: extensions,
            jsx: getJsxOption(opts.jsxRuntime),
            jsxImportSource: opts.jsxImportSource,
            loader: {
              ".js": "jsx",
              ".mjs": "jsx",
            },
            plugins: [
              esbuildFlowPlugin(
                new RegExp(/\.(flow|jsx?)$/),
                (_path: string) => "jsx",
              ),
            ],
          },
        },

        build: {
          rollupOptions: {
            // Use safest tree-shaking preset to avoid compatibility issues
            treeshake: "safest",
            plugins: [
              {
                name: "treeshake-fix",
                async transform(_code: string, id: string) {
                  if (
                    id.includes("react-native-css-interop") ||
                    id.includes("react-native-css") ||
                    id.includes("expo-modules-core")
                  ) {
                    return { moduleSideEffects: "no-treeshake" };
                  }
                },
              },
            ],
          },
        },

        resolve: {
          extensions,
          alias: {
            "react-native": "react-native-web",
          },
        },
      } satisfies Omit<vite.UserConfig, "plugins">;
    },
    configResolved(config) {
      isProduction = config.isProduction;
    },
    transform: {
      filter: {
        id: {
          include: makeIdFiltersToMatchWithQuery(include),
          exclude: makeIdFiltersToMatchWithQuery(exclude),
        },
      },
      async handler(code, id, options) {
        const [filepath] = id.split("?");
        if (!filter(filepath)) return;

        // Apply React Native Reanimated webUtils transformation if needed
        const transformResult = transformReanimatedWebUtilsWithMap(
          code,
          id,
          isProduction,
          {
            source: filepath,
          },
        );

        if (!transformResult.changed) return null;

        return { code: transformResult.code, map: transformResult.map };
      },
    },
  };

  return [
    flowPlugin({
      exclude,
    }),
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (id.match(/\.js$/) || id.match(/\.mjs$/)) {
          const jsxOption = getJsxOption(opts.jsxRuntime);

          return vite.transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: jsxOption,
            jsxImportSource: opts.jsxImportSource,
          });
        }

        return null;
      },
    },
    commonjs(),
    rnwPlugin,
    react({
      ...opts,
      exclude,
    }),
  ];
}
