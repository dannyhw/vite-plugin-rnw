import { defineConfig } from "vite";

// yeah i don't know
import { rnw } from "../../packages/vite-plugin-rnw/dist/index.cjs";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    rnw({
      jsxRuntime: "automatic",
      jsxImportSource: "nativewind",
      babel: {
        presets: ["nativewind/babel"],
        plugins: [
          "@babel/plugin-proposal-export-namespace-from",
          "react-native-worklets/plugin",
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      // required for skia web
      "react-native/Libraries/Image/AssetRegistry": path.resolve(
        __dirname,
        "./stub.js"
      ),
    },
  },
});
