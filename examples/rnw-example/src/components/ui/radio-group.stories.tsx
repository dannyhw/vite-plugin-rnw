import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  render: () => (
    <RadioGroup value="1" onValueChange={() => {}}>
      <RadioGroupItem value="1" />
    </RadioGroup>
  ),
};

export default meta;

export const Default: StoryObj<typeof RadioGroup> = {
  args: {},
};
