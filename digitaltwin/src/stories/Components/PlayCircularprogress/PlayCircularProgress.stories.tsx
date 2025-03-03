import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import PlayCircularProgress from "../../../components/atomic/PlayCircularProgress/PlayCircularProgress";

export default {
  title: "PlayCircularProgress",
  component: PlayCircularProgress,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      
      description: {
        component: "PlayCircularProgress is a component for displaying circular progress indicators.",
      },
      
    },
  },
  
  argTypes: {
    size: { control: "number", description: "Size of the circular progress indicator" },
    strokeWidth: { control: "number", description: "Stroke width of the circular progress indicator" },
    color: { control: "color", description: "Color of the circular progress indicator" }, 
  },
} as Meta<typeof PlayCircularProgress>;

const Template: StoryFn<typeof PlayCircularProgress> = (args) => <PlayCircularProgress {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 50,
  strokeWidth: 10,
};

export const LargerProgress = Template.bind({});
LargerProgress.args = {
  size: 100,
  strokeWidth: 20,
//   color: "green",
};
