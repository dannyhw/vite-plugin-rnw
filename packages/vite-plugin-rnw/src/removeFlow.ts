import { readFile } from "node:fs/promises";
// @ts-expect-error no types
import flowRemoveTypes from "flow-remove-types";
import { createFilter } from "vite";
import type { Plugin, Rolldown } from "vite";
import type { Plugin as EsbuildPlugin, Loader } from "esbuild";

type FilterPattern = string | RegExp | Array<string | RegExp>;

export type FlowOptions = {
  all: boolean;
  pretty: boolean;
  ignoreUninitializedFields: boolean;
};

export type ViteFlowPluginOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
  flow?: FlowOptions;
};

const defaultFlowOptions: FlowOptions = {
  all: false,
  pretty: false,
  ignoreUninitializedFields: false,
};

const defaultPluginOptions: ViteFlowPluginOptions = {
  include: /\.(flow|jsx?)$/,
  exclude: /node_modules/,
  flow: defaultFlowOptions,
};

const jsxRegex = /\.jsx$/;

const defaultLoaderFunction = (path: string) =>
  jsxRegex.test(path) ? "jsx" : "js";

const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));

/**
 * Create a Vite plugin object.
 */
export function flowPlugin({
  exclude = defaultPluginOptions.exclude,
  include = defaultPluginOptions.include,
  flow = defaultFlowOptions,
}: ViteFlowPluginOptions = defaultPluginOptions): Plugin {
  const filter = createFilter(include, exclude);

  return {
    enforce: "pre",
    name: "flow",
    transform(src: string, id: string) {
      if (!filter(id)) {
        return null;
      }

      const transformed = flowRemoveTypes(src, flow);
      return {
        code: transformed.toString(),
        map: null,
      };
    },
  } satisfies Plugin;
}

/**
 * Create an esbuild plugin object.
 */
export function esbuildFlowPlugin(
  filter: RegExp = /\.(flow|jsx?)$/,
  loaderFunction: (path: string) => Loader = defaultLoaderFunction,
  flowOptions: FlowOptions = defaultFlowOptions,
): EsbuildPlugin {
  return {
    name: "flow",

    setup(build) {
      build.onLoad({ filter }, async ({ path, namespace }) => {
        try {
          const src = await readFile(path, "utf-8");
          const transformed = flowRemoveTypes(src, flowOptions);

          return {
            contents: transformed.toString(),
            loader: loaderFunction(path),
          };
        } catch (error) {
          const resolvedError = toError(error);

          return {
            errors: [
              {
                text: resolvedError.message,
                location: {
                  file: path,
                  namespace,
                },
                detail: resolvedError,
              },
            ],
          };
        }
      });
    },
  } satisfies EsbuildPlugin;
}

export function rollDownFlowPlugin(
  filter: RegExp = /\.(flow|jsx?)$/,
  loaderFunction: (path: string) => Loader = defaultLoaderFunction,
  flowOptions: FlowOptions = defaultFlowOptions,
): Rolldown.Plugin {
  return {
    name: "rolldown-flow",

    load: {
      filter: {
        id: {
          include: filter,
        },
      },
      handler: async (id) => {
        const src = await readFile(id, "utf-8");
        const transformed = flowRemoveTypes(src, flowOptions);
        return {
          code: transformed.toString(),
          moduleType: loaderFunction(id),
        };
      },
    },
  } satisfies Rolldown.Plugin;
}
