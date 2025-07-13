import { Pressable, Text } from "react-native";

export function NWButton({
  onPress,
  text,
}: {
  onPress: () => void;
  text: string;
}) {
  return (
    <Pressable
      className="bg-blue-500 text-white py-2 px-4 rounded active:bg-blue-600 self-start"
      onPress={onPress}
    >
      <Text className="text-white font-bold">{text}</Text>
    </Pressable>
  );
}
