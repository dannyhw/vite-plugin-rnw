import type {
  CanvasKit,
  CanvasKitInitOptions,
} from "canvaskit-wasm";
import canvasKitUrl from "canvaskit-wasm/bin/full/canvaskit.js?url";
import { lazy, Suspense } from "react";
import { Text } from "react-native";

type CanvasKitInitializer = (
  options?: CanvasKitInitOptions,
) => Promise<CanvasKit>;

type CanvasKitGlobals = typeof globalThis & {
  CanvasKit?: CanvasKit;
  CanvasKitInit?: CanvasKitInitializer;
};

let canvasKitPromise: Promise<void> | undefined;

function loadCanvasKit() {
  const globals = globalThis as CanvasKitGlobals;

  if (globals.CanvasKit) {
    return Promise.resolve();
  }

  canvasKitPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    // CanvasKit's generated glue must stay paired with canvaskit.wasm and must
    // not be rewritten by Vite's dependency optimizer.
    script.src = canvasKitUrl;
    script.async = true;
    script.onload = async () => {
      try {
        if (!globals.CanvasKitInit) {
          throw new Error("CanvasKit initializer was not loaded");
        }

        globals.CanvasKit = await globals.CanvasKitInit({
          locateFile: () => "/canvaskit.wasm",
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    script.onerror = () => reject(new Error("Failed to load CanvasKit"));
    document.head.appendChild(script);
  });

  return canvasKitPromise;
}

const SkiaExample = lazy(async () => {
  await loadCanvasKit();
  return import("./skia");
});

export const SkiaLoader = () => {
  return (
    <Suspense fallback={<Text>Loading Skia...</Text>}>
      <SkiaExample />
    </Suspense>
  );
};
