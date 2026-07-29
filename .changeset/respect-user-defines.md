---
"vite-plugin-rnw": patch
---

Respect user-provided `define` values: entries set in the user config now take precedence over the plugin defaults and are propagated to dependency optimization (e.g. production builds with `__DEV__: true`).
