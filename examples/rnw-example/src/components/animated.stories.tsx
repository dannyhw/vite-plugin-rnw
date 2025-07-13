import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedLogo } from "./animated";

const meta: Meta<typeof AnimatedLogo> = {
  component: AnimatedLogo,
};

export default meta;

type Story = StoryObj<typeof AnimatedLogo>;

export const Default: Story = {};
