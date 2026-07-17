// This internal Expo module covers the dependency-optimizer failure from issue #14.
import { getBaseUrl } from "@expo/log-box/src/utils/devServerEndpoints";
import { Text, View } from "react-native";

export function ExpoLogBoxExample() {
  return (
    <View>
      <Text style={{ fontSize: 12, color: "white" }}>Expo LogBox</Text>
      <Text style={{ fontSize: 12, color: "white" }}>{getBaseUrl()}</Text>
    </View>
  );
}
