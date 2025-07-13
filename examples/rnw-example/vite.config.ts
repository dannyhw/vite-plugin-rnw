import { defineConfig } from "vite";

// yeah i don't know
import { rnw } from "../../packages/vite-plugin-rnw/dist/index.cjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    rnw({
      jsxRuntime: "automatic",
      // jsxImportSource: "nativewind",
      babel: {
        // presets: ["nativewind/babel"],
        plugins: [
          "@babel/plugin-proposal-export-namespace-from",
          "react-native-reanimated/plugin",
        ],
      },
    }),
  ],
});
