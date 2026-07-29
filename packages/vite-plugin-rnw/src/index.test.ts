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

test("user-provided defines take precedence over the plugin defaults", async () => {
  const plugins = rnw().flat() as Plugin[];
  const plugin = plugins.find(
    (candidate) => candidate.name === "vite:react-native-web-babel",
  );

  assert.ok(plugin);
  assert.equal(typeof plugin.config, "function");

  if (typeof plugin.config !== "function") return;

  const config = (await plugin.config.call(
    {} as never,
    {
      define: {
        // string values are kept as-is, non-strings are stringified like
        // Vite does for the root `define`
        __DEV__: "true",
        _WORKLET: true,
        // defines the plugin does not manage are left to Vite's own merging
        "process.env.MY_APP_FLAG": JSON.stringify("on"),
      },
    },
    {
      command: "build",
      mode: "production",
      isPreview: false,
      isSsrBuild: false,
    },
  )) as UserConfig;

  assert.equal(config.define?.["__DEV__"], "true");
  assert.equal(config.define?.["_WORKLET"], "true");
  // defaults the user did not override are unchanged
  assert.equal(config.define?.["global"], "window");
  assert.equal(config.define?.["DEV"], "false");
  // unmanaged user defines are not duplicated into the plugin's config
  assert.equal("process.env.MY_APP_FLAG" in (config.define ?? {}), false);
  // overrides are propagated to dependency optimization
  assert.equal(
    config.optimizeDeps?.rolldownOptions?.transform?.define?.["__DEV__"],
    "true",
  );
});
