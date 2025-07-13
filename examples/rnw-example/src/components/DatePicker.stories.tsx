import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./datepicker";
import { Text, View } from "react-native";

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  decorators: [
    (Story) => (
      <View className="items-start">
        <Text>
          DatePicker, if this doesn't error then flow type removal is working
        </Text>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};
