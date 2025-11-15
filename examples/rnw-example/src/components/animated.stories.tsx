import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatedLogo } from "./animated";

const meta: Meta<typeof AnimatedLogo> = {
  component: AnimatedLogo,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

type Story = StoryObj<typeof AnimatedLogo>;

export const Default: Story = {};
