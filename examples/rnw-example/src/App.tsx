import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { AnimatedLogo } from "./components/animated";
import { DatePicker } from "./components/datepicker";
import { ExpoImageExample } from "./components/expo-image";
import { Ball } from "./components/gesture";
import { NWButton } from "./components/nativewind";
import Toast2 from "./components/toast";
import { SkiaLoader } from "./components/skialoader";
import "./global.css";

export default function App() {
  const [count, setCount] = useState(0);
  const scale = useSharedValue(1);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#242424",
        width: "100%",
        height: "100%",
        padding: 80,
      }}
    >
      <AnimatedLogo />

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "white",
          marginVertical: 32,
        }}
      >
        Vite + React Native
      </Text>

      <Pressable
        onPress={() => {
          setCount((count) => count + 1);
          scale.value = withSequence(
            withTiming(1.2, { duration: 200 }),
            withTiming(1, { duration: 200 })
          );
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: "grey",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            },
            { transform: [{ scale: scale }] },
          ]}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
            }}
          >
            count is {count}
          </Text>
        </Animated.View>
      </Pressable>

      <View style={{ gap: 32, flexDirection: "column", marginTop: 32 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          Examples
        </Text>

        <NWButton onPress={() => {}} text="nativewind button" />

        <ExpoImageExample />

        <Toast />

        <Text style={{ fontSize: 12, color: "white" }}>Toast</Text>
        <Toast2 />

        <Text style={{ fontSize: 12, color: "white" }}>Gesture Handler</Text>
        <Ball />

        <Text style={{ fontSize: 12, color: "white" }}>Skia Web Example</Text>
        <View
          style={{
            width: "100%",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SkiaLoader />
        </View>

        <DatePicker />
      </View>
    </View>
  );
}
