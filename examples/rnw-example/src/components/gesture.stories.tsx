import type { Meta, StoryObj } from "@storybook/react-vite";
import { Ball } from "./gesture";

const meta: Meta<typeof Ball> = {
  component: Ball,
};

export default meta;

export const Default: StoryObj<typeof Ball> = {};
