import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  dts: true,
  deps: {
    neverBundle: ["vite", "rollup", "rolldown"],
  },
});
