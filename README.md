# vite-plugin-rnw

A vite plugin for React Native Web projects. (edited from a version of the react plugin)

- enable [Fast Refresh](https://www.npmjs.com/package/react-refresh) in development (requires react >= 16.9)
- use the [automatic JSX runtime](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
- use custom Babel plugins/presets
- small installation size

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

> `node_modules` can be processed by this plugin when needed
> the excludes default is `/\/node_modules\/(?!react-native|@react-native|expo|@expo)/;`

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

#### Proposed syntax

If you are using ES syntax that are still in proposal status (e.g. class properties), you can selectively enable them with the `babel.parserOpts.plugins` option:

```js
rnw({
  babel: {
    parserOpts: {
      plugins: ["decorators-legacy"],
    },
  },
});
```

This option does not enable _code transformation_. That is handled by esbuild.

**Note:** TypeScript syntax is handled automatically.

Here's the [complete list of Babel parser plugins](https://babeljs.io/docs/en/babel-parser#ecmascript-proposalshttpsgithubcombabelproposals).

## Consistent components exports

For React refresh to work correctly, your file should only export React components. You can find a good explanation in the [Gatsby docs](https://www.gatsbyjs.com/docs/reference/local-development/fast-refresh/#how-it-works).

If an incompatible change in exports is found, the module will be invalidated and HMR will propagate. To make it easier to export simple constants alongside your component, the module is only invalidated when their value changes.

You can catch mistakes and get more detailed warning with this [eslint rule](https://github.com/ArnaudBarre/eslint-plugin-react-refresh).
