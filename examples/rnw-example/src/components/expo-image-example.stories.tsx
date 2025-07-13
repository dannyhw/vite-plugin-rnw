import type { Meta, StoryObj } from "@storybook/react";
import { ExpoImageExample } from "./expo-image";

const meta = {
  title: "Components/ExpoImage",
  component: ExpoImageExample,
} satisfies Meta<typeof ExpoImageExample>;

export default meta;

export const Default: StoryObj<typeof ExpoImageExample> = {};
