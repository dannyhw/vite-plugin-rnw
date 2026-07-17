import assert from "node:assert/strict";
import { test } from "node:test";
import type { Plugin, UserConfig } from "vite";

import { rnw } from "./index.ts";

test("defines the Expo web platform during dependency optimization", async () => {
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
    EXPO_OS: JSON.stringify("web"),
    "process.env.EXPO_OS": JSON.stringify("web"),
  };

  assert.deepEqual(config.define?.EXPO_OS, expectedDefines.EXPO_OS);
  assert.deepEqual(
    config.define?.["process.env.EXPO_OS"],
    expectedDefines["process.env.EXPO_OS"],
  );
  assert.deepEqual(
    config.optimizeDeps?.rolldownOptions?.transform?.define,
    expectedDefines,
  );
  assert.equal(config.optimizeDeps?.rolldownOptions?.shimMissingExports, true);
});
