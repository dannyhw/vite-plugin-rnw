import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { DatePicker } from "./components/datepicker";
import { NWButton } from "./components/nativewind";
import { ExpoImageExample } from "./components/expo-image";
import Toast2 from "./components/toast";
import Toast from "react-native-toast-message";
import "./global.css";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function App() {
  const [count, setCount] = useState(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(withTiming(360, { duration: 3000 }), -1, false);
  }, [rotate]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#242424",
        width: "100%",
        height: "100%",
        gap: 10,
      }}
    >
      <View>
        <Animated.Image
          source={require("./assets/react.png")}
          alt="React logo"
          style={[
            {
              width: 100,
              height: 100,
            },
            animatedStyle,
          ]}
          resizeMode="contain"
        />
      </View>

      <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
        Vite + React Native
      </Text>

      <View
        style={{
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatedPressable
          onPress={() => {
            setCount((count) => count + 1);
            scale.value = withSequence(
              withTiming(1.2, { duration: 200 }),
              withTiming(1, { duration: 200 })
            );
          }}
          style={[
            { transform: [{ scale: scale }] },
            {
              backgroundColor: "grey",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              userSelect: "none",
            },
          ]}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            count is {count}
          </Text>
        </AnimatedPressable>

        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          Edit src/App.tsx and save to test HMR
        </Text>
      </View>

      <View style={{ gap: 10, flexDirection: "column" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          Examples
        </Text>

        <DatePicker />

        <NWButton onPress={() => {}} text="nativewind button" />

        <ExpoImageExample />

        <Toast />
        <Toast2 />
      </View>
    </View>
  );
}
