# vite-plugin-rnw

A vite plugin for React Native Web projects.

This plugin uses the [react plugin](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) internally and applies a lot of fixes for react native web on top.

```js
// vite.config.js
import { defineConfig } from "vite";
import { rnw } from "vite-plugin-rnw";

export default defineConfig({
  plugins: [rnw()],
});
```

## Options

### include/exclude

Includes `.js`, `.jsx`, `.ts` & `.tsx` by default. This option can be used to add fast refresh to other files:

```js
import { defineConfig } from "vite";
import { rnw } from "vite-plugin-rnw";

export default defineConfig({
  plugins: [rnw({ include: /\.(js|jsx|ts|tsx)$/ })],
});
```

`node_modules` can be processed by this plugin when needed

By default the excludes pattern is:

```js
/\/node_modules\/(?!react-native|@react-native|expo|@expo)/;
```

This means any package that starts with react-native, @react-native, expo, or @expo will be included and other node_modules will be excluded. But you can change this to include or exclude any package you want.

### jsxImportSource

Control where the JSX factory is imported from. Default to `'react'`

```js
rnw({ jsxImportSource: "nativewind" });
```

### babel

The `babel` option lets you add plugins, presets, and [other configuration](https://babeljs.io/docs/en/options) to the Babel transformation performed on each included file.

```js
rnw({
  babel: {
    presets: [...],
    // Your plugins run before any built-in transform (eg: Fast Refresh)
    plugins: [...],
    // Use .babelrc files
    babelrc: true,
    // Use babel.config.js files
    configFile: true,
  }
})
```
