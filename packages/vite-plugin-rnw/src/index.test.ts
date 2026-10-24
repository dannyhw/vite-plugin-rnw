import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { resolveConfig, type Plugin, type UserConfig } from "vite";

import { rnw } from "./index.ts";

test("uses the runtime defines during dependency optimization", async () => {
  const plugins = rnw().flat() as Plugin[];
  const plugin = plugins.find(
    (candidate) => candidate.name === "vite:react-native-web-babel",
  );

  assert.ok(plugin);
  assert.equal(typeof plugin.config, "function");

  if (typeof plugin.config !== "function") return;

  const config = (await plugin.config.call(
    {} as never,
    {},
    {
      command: "serve",
      mode: "development",
      isPreview: false,
      isSsrBuild: false,
    },
  )) as UserConfig;

  const expectedDefines = {
    global: "window",
    DEV: "true",
    "global.__x": "{}",
    _frameTimestamp: "undefined",
    _WORKLET: "false",
    __DEV__: "true",
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development",
    ),
    EXPO_OS: JSON.stringify("web"),
    "process.env.EXPO_OS": JSON.stringify("web"),
    "global.Error": "Error",
  };

  assert.deepEqual(config.define, expectedDefines);
  assert.deepEqual(
    config.optimizeDeps?.rolldownOptions?.transform?.define,
    expectedDefines,
  );
  assert.equal(config.optimizeDeps?.rolldownOptions?.shimMissingExports, true);
});

test("resolves source files before JSON files with the same name", async () => {
  // In Expo apps `app.json` sits next to `App.tsx`. On case-insensitive file
  // systems `./App` must still resolve to the source file, as it does in Metro.
  const root = await mkdtemp(path.join(tmpdir(), "vite-plugin-rnw-"));

  try {
    await writeFile(path.join(root, "App.tsx"), "export default 1;\n");
    await writeFile(path.join(root, "App.json"), "{}\n");

    const config = await resolveConfig(
      { root, configFile: false, logLevel: "silent", plugins: [rnw()] },
      "serve",
    );

    const jsonIndex = config.resolve.extensions.indexOf(".json");
    for (const ext of [".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".cjs"]) {
      assert.ok(
        config.resolve.extensions.indexOf(ext) < jsonIndex,
        `${ext} should resolve before .json`,
      );
    }

    const resolve = config.createResolver();
    const resolved = await resolve("./App", path.join(root, "index.ts"));
    assert.equal(resolved && path.basename(resolved), "App.tsx");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
