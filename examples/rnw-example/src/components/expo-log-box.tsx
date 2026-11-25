// Covers the dependency-optimizer failure from issue #14: LogBoxLog pulls in
// @expo/log-box's dev server utilities, which read Expo env defines and
// expo internals during pre-bundling.
import { LogBoxLog } from "@expo/log-box/Data/LogBoxLog";
import { getBundleOrigin } from "expo/internal/bundle-origin";
import { Text, View } from "react-native";

export function ExpoLogBoxExample() {
  return (
    <View>
      <Text style={{ fontSize: 12, color: "white" }}>Expo LogBox</Text>
      <Text style={{ fontSize: 12, color: "white" }}>
        {LogBoxLog.name}: {getBundleOrigin() ?? "no bundle origin"}
      </Text>
    </View>
  );
}
