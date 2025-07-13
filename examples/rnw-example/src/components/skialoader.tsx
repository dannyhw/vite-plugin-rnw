import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { Text } from "react-native";

export const SkiaLoader = () => {
  return (
    <WithSkiaWeb
      opts={{ locateFile: () => "/canvaskit.wasm" }}
      getComponent={async () => import("./skia")}
      fallback={<Text>Loading Skia...</Text>}
    />
  );
};
