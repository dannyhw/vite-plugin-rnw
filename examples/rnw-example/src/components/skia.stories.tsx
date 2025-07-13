import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkiaLoader } from "./skialoader";

const meta: Meta<typeof SkiaLoader> = {
  component: SkiaLoader,
};

export default meta;

export const Default: StoryObj<typeof meta> = {};
