import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  dts: true,
  external: ["vite", "rollup", "rolldown"],
});
