import type { Meta, StoryObj } from "@storybook/react";
import ToastComp from "./toast";
import { View } from "react-native";
import Toast from "react-native-toast-message";

const meta = {
  component: ToastComp,
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
        <Toast />
      </View>
    ),
  ],
} satisfies Meta<typeof ToastComp>;

export default meta;

export const Default: StoryObj<typeof ToastComp> = {};
