import type { StorybookConfig } from "@storybook/react-vite";
import { viteFinal as reactViteFinal } from "@storybook/react-vite/preset";
import { InlineConfig } from "vite";
import { rnw } from "../../../packages/vite-plugin-rnw/dist/index.cjs";

export const viteFinal: StorybookConfig["viteFinal"] = async (
  config,
  options
) => {
  const { mergeConfig } = await import("vite");

  //   const { pluginReactOptions = {} } =
  //     await options.presets.apply<FrameworkOptions>("frameworkOptions");

  //   const isDevelopment = options.configType !== "PRODUCTION";

  const { plugins = [], ...reactConfigWithoutPlugins } = await reactViteFinal(
    config,
    options
  );

  return mergeConfig(reactConfigWithoutPlugins, {
    plugins: [
      rnw({
        jsxRuntime: "automatic",
        jsxImportSource: "nativewind",
        babel: {
          presets: ["nativewind/babel"],
          plugins: [
            "@babel/plugin-proposal-export-namespace-from",
            "react-native-reanimated/plugin",
          ],
        },
      }),
      ...plugins,
    ],
  } satisfies InlineConfig);
};

export const core = {
  builder: "@storybook/builder-vite",
  renderer: "@storybook/react",
};
