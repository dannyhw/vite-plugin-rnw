import type { Meta, StoryObj } from "@storybook/react";
import { NWButton } from "./nativewind";
import { View } from "react-native";

const meta = {
  component: NWButton,
  decorators: [
    (Story) => (
      <View className="items-start">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof NWButton>;

export default meta;

type Story = StoryObj<typeof NWButton>;

export const Primary: Story = {
  args: {
    text: "Click me",
    onPress: () => {},
  },
};
