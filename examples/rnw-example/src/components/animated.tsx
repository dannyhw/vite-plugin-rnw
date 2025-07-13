import { useEffect } from "react";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const AnimatedLogo = () => {
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
    <Animated.Image
      source={require("../assets/react.png")}
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
  );
};
