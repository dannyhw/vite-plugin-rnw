import assert from "node:assert/strict";
import { test } from "node:test";
import type { Plugin, UserConfig } from "vite";

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
