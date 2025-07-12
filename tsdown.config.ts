import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  format: ["esm", "cjs"],
  outputOptions(outputOpts, format) {
    if (format === "cjs") {
      outputOpts.footer = (chunk) => {
        // don't append to dts files
        if (chunk.fileName.endsWith(".cjs")) {
          return "module.exports.default = module.exports";
        }
        return "";
      };
    }
    return outputOpts;
  },
});
