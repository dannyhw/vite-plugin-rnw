import { StyleSheet } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const styles = StyleSheet.create({
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "blue",
    alignSelf: "center",
  },
});

export function Ball() {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });

  const animatedStyles = useAnimatedStyle(() => {
    const position = offset.get();
    const pressed = isPressed.get();

    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { scale: withSpring(pressed ? 1.2 : 1) },
      ],
      backgroundColor: pressed ? "yellow" : "blue",
    };
  });
  const start = useSharedValue({ x: 0, y: 0 });
  const gesture = usePanGesture({
    onBegin: () => {
      isPressed.set(true);
    },
    onUpdate: (e) => {
      const startPosition = start.get();

      offset.set({
        x: e.translationX + startPosition.x,
        y: e.translationY + startPosition.y,
      });
    },
    onDeactivate: () => {
      const position = offset.get();

      start.set({
        x: position.x,
        y: position.y,
      });
    },
    onFinalize: () => {
      isPressed.set(false);
    },
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.ball, animatedStyles]} />
    </GestureDetector>
  );
}
