---
"vite-plugin-rnw": patch
---

resolve `.ts`/`.tsx`/`.js` sources before `.json` so `./App` no longer resolves to Expo's `app.json` on case-insensitive file systems
