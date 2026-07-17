# React Native Web example

This app exercises `vite-plugin-rnw` with React Native Web, Expo modules,
Gesture Handler, Reanimated, and Skia.

## Commands

- `bun dev` starts the Vite development server.
- `bun build` type-checks with TypeScript and creates a production build.
- `bun lint` checks the project with Oxlint.
- `bun lint:fix` applies Oxlint's safe fixes.
- `bun storybook` starts Storybook.
- `bun build-storybook` creates a static Storybook build.
- `bun repro:issue-14` starts the issue 14 reproduction with a forced
  dependency optimization pass.

Oxlint is configured in `.oxlintrc.json` with its native TypeScript and React
plugins. Correctness rules, React Hooks checks, Fast Refresh export checks, and
React Compiler diagnostics are enabled.
