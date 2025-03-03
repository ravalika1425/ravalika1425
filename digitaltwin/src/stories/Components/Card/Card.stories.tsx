import React from "react"
import { Meta, StoryFn } from "@storybook/react"
import PlayCard from "../../../components/atomic/PlayCard/PlayCard"

export default {
  title: "PlayCard",
  component: PlayCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "PlayCard is a flexible card component for displaying content with optional headers and footers.",
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "Title of the card" },
    subtitle: { control: "text", description: "Subtitle of the card" },
    children: { control: "text", description: "Content of the card" },
    footer: { control: "text", description: "Footer content of the card" },
  },
} as Meta<typeof PlayCard>

const Template: StoryFn<typeof PlayCard> = (args: React.ComponentProps<typeof PlayCard>) => (
  <PlayCard {...args} />
)

export const Default = Template.bind({})
Default.args = {
  title: "Card Title",
  subtitle: "Card Subtitle",
  children: "This is the main content of the card.",
  footer: "Footer Information",
}

export const NoFooter = Template.bind({})
NoFooter.args = {
  title: "No Footer Title",
  subtitle: "No Footer Subtitle",
  children: "This card does not have a footer.",
}

export const OnlyContent = Template.bind({})
OnlyContent.args = {
  children: "Only content without title, subtitle, or footer.",
}
