import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./datepicker";

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};
