import {
  createFilter,
  version as viteVersion,
  type DepOptimizationOptions,
} from "vite";
import * as vite from "vite";

import commonjs from "vite-plugin-commonjs";
import type { BuildOptions, Plugin } from "vite";
import { makeIdFiltersToMatchWithQuery } from "@rolldown/pluginutils";
import {
  transformReanimatedWebUtilsWithMap,
  transformCssInteropDoctorCheck,
} from "./transforms.ts";
import react, { type Options } from "@vitejs/plugin-react";
import {
  esbuildFlowPlugin,
  rollDownFlowPlugin,
  flowPlugin,
} from "./removeFlow.ts";

const shouldUseRolldownOptions = () => {
  try {
    return Number(viteVersion.split(".")[0]) >= 8;
  } catch {
    return false;
  }
};

const shouldUseRollDown = shouldUseRolldownOptions();

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

const expoWebDefines = {
  EXPO_OS: JSON.stringify("web"),
  "process.env.EXPO_OS": JSON.stringify("web"),
};

const getRuntimeDefines = (mode: string) => {
  const development = mode === "development";

  return {
    global: "window",
    DEV: JSON.stringify(development),
    "global.__x": "{}",
    _frameTimestamp: "undefined",
    _WORKLET: "false",
    __DEV__: JSON.stringify(development),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || mode),
    ...expoWebDefines,
    "global.Error": "Error",
  } satisfies Record<string, string>;
};

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

const treeshakePlugin = {
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
} satisfies vite.Rolldown.Plugin;

// safest tree-shaking preset
const treeshakeSafePreset = {
  annotations: true,
  invalidImportSideEffects: true,
  manualPureFunctions: [],
  moduleSideEffects: true,
  propertyReadSideEffects: "always",
  unknownGlobalSideEffects: true,
  propertyWriteSideEffects: "always",
} satisfies vite.Rolldown.TreeshakingOptions;

function getBuildOptions(): BuildOptions {
  if (shouldUseRollDown) {
    return {
      rolldownOptions: {
        shimMissingExports: true,
        treeshake: treeshakeSafePreset,
        plugins: [treeshakePlugin],
      },
    } satisfies BuildOptions;
  }

  return {
    rollupOptions: {
      shimMissingExports: true,
      treeshake: treeshakeSafePreset,
      plugins: [treeshakePlugin],
    },
  } satisfies BuildOptions;
}

function getOptimizeDepsOptions(
  opts: RnwOptions,
  defines: Record<string, string>,
): DepOptimizationOptions {
  if (shouldUseRollDown) {
    return {
      rolldownOptions: {
        shimMissingExports: true,
        resolve: { extensions },
        transform: {
          define: defines,
          jsx: {
            importSource: opts.jsxImportSource,
            runtime: opts.jsxRuntime,
          },
        },
        moduleTypes: {
          ".js": "jsx",
          ".mjs": "jsx",
        },
        plugins: [
          rollDownFlowPlugin(
            new RegExp(/\.(flow|jsx?)$/),
            (_path: string) => "jsx",
          ),
        ],
      },
    } satisfies DepOptimizationOptions;
  }
  return {
    esbuildOptions: {
      define: defines,
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
  } satisfies DepOptimizationOptions;
}

export function rnw(opts: RnwOptions = {}): Array<Plugin | Plugin[]> {
  const include = opts.include ?? defaultIncludeRE;
  const exclude = opts.exclude ?? defaultExcludeRE;
  const filter = createFilter(include, exclude);
  let isProduction = true;

  const rnwPlugin: Plugin = {
    name: "vite:react-native-web-babel",
    enforce: "pre",
    config(userConfig, { mode }) {
      const defines: Record<string, string> = { ...getRuntimeDefines(mode) };

      // User-provided defines take precedence over the plugin defaults, and
      // are propagated to dependency optimization so pre-bundled deps see the
      // same values (e.g. a production build with `__DEV__: true`).
      for (const [key, value] of Object.entries(userConfig.define ?? {})) {
        if (key in defines) {
          defines[key] = typeof value === "string" ? value : JSON.stringify(value);
        }
      }

      return {
        define: defines,

        optimizeDeps: getOptimizeDepsOptions(opts, defines),

        build: getBuildOptions(),

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
      async handler(code, id, _options) {
        const [filepath] = id.split("?");
        if (!filter(filepath)) return;

        // First, fix react-native-css-interop doctor check
        const cssInteropResult = transformCssInteropDoctorCheck(code, id, {
          source: filepath,
        });
        if (cssInteropResult.changed) {
          return {
            code: cssInteropResult.code,
            map: cssInteropResult.map,
          };
        }

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
      enforce: "pre",
      async transform(code, id) {
        if (id.match(/\.js$/) || id.match(/\.mjs$/)) {
          const jsxOption = getJsxOption(opts.jsxRuntime);
          if (shouldUseRollDown) {
            return vite.transformWithOxc(code, id, {
              lang: "jsx",
              jsx: {
                importSource: opts.jsxImportSource,
                runtime: opts.jsxRuntime,
              },
            });
          }

          return vite.transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: jsxOption,
            jsxImportSource: opts.jsxImportSource,
          });
        }

        return null;
      },
    },
    commonjs() as Plugin,
    rnwPlugin,
    react({
      ...opts,
      exclude,
    }) as Plugin[],
  ];
}
