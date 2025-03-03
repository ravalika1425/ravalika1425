import React from "react"
import { Meta, StoryFn } from "@storybook/react"
import { PlayButton } from "../../../components/atomic/PlayButton/PlayButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoffee } from "@fortawesome/free-solid-svg-icons"

const meta: Meta<typeof PlayButton> = {
  title: "PlayButton",
  component: PlayButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "PlayButton is a versatile button component supporting various sizes, types, and states, including optional icons.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "secondary",
        "primary",
        "info",
        "success",
        "warning",
        "help",
        "danger",
        "contrast",
        "link",
      ],
      description: "The variant of the button",
    },
    size: {
      control: "select",
      options: ["sm", "lg"],
      description: "The size of the button",
    },
    type: {
      control: "select",
      options: ["outlined", "plain", "text"],
      description: "The type of the button",
    },
    disabled: {
      control: "boolean",
      description: "If the button is disabled",
    },
    loading: {
      control: "boolean",
      description: "If the button is in a loading state",
    },
    iconPosition: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
      description: "The position of the icon in the button",
    },
    speedDial: {
      control: "boolean",
      description: "If the button uses a speed dial action",
    },
    speedDialDirection: {
      control: "select",
      options: ["up", "down", "left", "right"],
      description: "The direction of the speed dial",
    },
    shape: {
      control: "select",
      options: ["circle", "semi-circle", "quarter-circle"],
      description: "The shape of the button when using speed dial",
    },
    splitButton: {
      control: "boolean",
      description: "If the button is a split button",
    },
    onClick: { action: "clicked" },
  },
}
export default meta

// Template for creating stories
const Template: StoryFn<typeof PlayButton> = (args: any) => {
  return <PlayButton {...args} />
}
// Stories for each variant
export const Primary = Template.bind({})
Primary.args = {
  children: "Primary Button",
  variant: "primary",
  icon: <FontAwesomeIcon icon={faCoffee} />,
  iconPosition: "left",
}

export const Secondary = Template.bind({})
Secondary.args = {
  children: "Secondary Button",
  variant: "secondary",
  icon: <FontAwesomeIcon icon={faCoffee} />,
  iconPosition: "right",
}

// Add similar blocks for 'info', 'success', 'warning', 'help', 'danger', 'contrast', 'link'

export const Disabled = Template.bind({})
Disabled.args = {
  children: "Disabled Button",
  variant: "primary",
  disabled: true,
}

export const Loading = Template.bind({})
Loading.args = {
  children: "Loading Button",
  variant: "primary",
  loading: true,
}

export const WithSpeedDial = Template.bind({})
WithSpeedDial.args = {
  children: "Speed Dial Button",
  variant: "primary",
  speedDial: true,
  speedDialDirection: "up",
  shape: "circle",
}

export const SplitButton = Template.bind({})
SplitButton.args = {
  children: "Split Button",
  variant: "primary",
  splitButton: true,
}

export const Info = Template.bind({})
Info.args = {
  children: "Info Button",
  variant: "info",
}

export const Success = Template.bind({})
Success.args = {
  children: "Success Button",
  variant: "success",
}

export const Warning = Template.bind({})
Warning.args = {
  children: "Warning Button",
  variant: "warning",
}

export const Danger = Template.bind({})
Danger.args = {
  children: "Danger Button",
  variant: "danger",
}

export const LargeButton = Template.bind({})
LargeButton.args = {
  children: "Large Button",
  size: "lg",
}

export const SmallButton = Template.bind({})
SmallButton.args = {
  children: "Small Button",
  size: "sm",
}

export const Outlined = Template.bind({})
Outlined.args = {
  children: "Outlined Button",
  type: "outlined",
}

export const Plain = Template.bind({})
Plain.args = {
  children: "Plain Button",
  type: "plain",
}

export const TextButton = Template.bind({})
TextButton.args = {
  children: "Text Button",
  type: "text",
}
