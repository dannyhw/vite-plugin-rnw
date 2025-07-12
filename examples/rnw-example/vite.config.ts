import { defineConfig } from "vite";

// yeah i don't know
import { rnw } from "../../packages/vite-plugin-rnw/dist/index.cjs";

// https://vite.dev/config/
export default defineConfig({
  mode: "development",
  plugins: [
    // @ts-expect-error - this is dumb
    rnw({
      jsxRuntime: "automatic",

      babel: {
        plugins: [
          "@babel/plugin-proposal-export-namespace-from",
          "react-native-reanimated/plugin",
        ],
      },
    }),
  ],
});
