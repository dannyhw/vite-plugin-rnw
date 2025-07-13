# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vite plugin for React Native Web projects, providing compatibility for React Native components in web environments through Vite. The plugin is based on `@vitejs/plugin-react` and includes features like Fast Refresh, automatic JSX runtime, and custom Babel plugins support.

## Key Commands

### Development
- `bun --filter rnw-example dev` - Run the example app in development mode
- `bun --filter vite-plugin-rnw build` - Build the plugin package

### Building and Testing
- `bun build` - Build the vite-plugin-rnw package
- `bun example` - Run the example React Native Web application
- `bun repo:fix` - Fix workspace dependencies using Sherif

### Example App Commands (in examples/rnw-example/)
- `bun dev` - Start the development server
- `bun build` - Build the example app (runs TypeScript check then Vite build)
- `bun lint` - Run ESLint on the example codebase
- `bun preview` - Preview the production build

## Architecture

### Package Structure
- `/packages/vite-plugin-rnw/` - Main plugin implementation
  - `src/index.ts` - Core plugin logic with Babel transformation, React Native Web aliasing, and Fast Refresh support
  - `src/refresh-utils.ts` - Fast Refresh utilities
  - `src/refresh-runtime.js` - Fast Refresh runtime code

### Key Plugin Features
1. **React Native Web Aliasing**: Automatically aliases `react-native` imports to `react-native-web`
2. **Extension Resolution**: Prioritizes `.web.js`, `.web.ts`, `.web.tsx` extensions for platform-specific code
3. **Babel Integration**: Supports custom Babel configurations with React Native specific transforms
4. **Fast Refresh**: Development mode hot reloading for React components
5. **Flow Support**: Built-in Flow type stripping
6. **CommonJS Support**: Handles CommonJS modules in React Native packages

### Default Configuration
- Excludes most node_modules except: `react-native`, `@react-native`, `expo`, `@expo`
- JSX runtime: automatic (configurable)
- Treats `.js` files as JSX
- Defines global variables for React Native compatibility (`__DEV__`, `global`, etc.)

### Example Usage
```javascript
import { defineConfig } from "vite";
import { rnw } from "vite-plugin-rnw";

export default defineConfig({
  plugins: [rnw({
    // Optional configuration
    jsxImportSource: "nativewind",
    babel: {
      plugins: ["react-native-reanimated/plugin"]
    }
  })],
});
```

## Development Notes

- The plugin uses Bun as the package manager (bun@1.2.18)
- Built with tsdown for TypeScript compilation
- Supports Vite versions 4.x through 7.x
- The example app demonstrates integration with NativeWind, Expo modules, and React Native community packages

## Known Issues and Fixes

### NativeWind Build Issues
**Issue**: When using NativeWind with `jsxImportSource: "nativewind"`, production builds fail with "Cannot add property 0, object is not extensible" errors.

**Root Cause**: The error occurs due to array modification patterns in `react-native-css-interop` (NativeWind's dependency) that Rollup's tree-shaking analysis cannot handle properly. Specifically, patterns like:
```javascript
const specificity = [];
specificity[SpecificityIndex.Inline] = 1;
```

**Solution**: The plugin automatically applies the `treeshake: 'safest'` configuration to prevent Rollup from performing aggressive optimizations that cause these extensibility errors. This is applied automatically - no user configuration required.

**Implementation**: In `src/index.ts`, the plugin's build configuration includes:
```typescript
build: {
  rollupOptions: {
    // Use safest tree-shaking preset to avoid extensibility issues
    treeshake: 'safest',
    plugins: [
      {
        name: "nativewind-fix",
        async transform(code, id) {
          // Preserve side-effects-only files in react-native-css-interop
          if (
            id.includes("react-native-css-interop") &&
            id.includes("runtime/components.js")
          ) {
            return { moduleSideEffects: "no-treeshake" };
          }
        },
      },
    ],
  }
}
```

This solution combines:
1. **Rollup's "safest" preset** - avoids aggressive optimizations that cause array extensibility issues
2. **Explicit side-effects preservation** - ensures critical runtime components aren't removed during tree-shaking

### React Native Reanimated Compatibility
The plugin also includes robust handling for React Native Reanimated's webUtils files, automatically transforming problematic `export let` + `try/catch` + `require` patterns into proper ESM imports/exports during production builds. This ensures compatibility with modern bundlers while maintaining runtime functionality.

The result is a build that works correctly with both NativeWind and React Native Reanimated while maintaining optimal bundle sizes.