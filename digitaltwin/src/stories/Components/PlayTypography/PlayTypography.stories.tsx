import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import PlayTypography, { PlayTypographyProps } from '../../../components/atomic/PlayTypography/PlayTypography';

export default {
  title: 'PlayTypography',
  component: PlayTypography,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: 'PlayTypography is a component for displaying text with customizable variants.',
      },
    },
  },
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['h1', 'h2', 'h3', 'p', 'span'],
      },
      description: 'Variant of the text',
    },
    children: { control: 'text', description: 'Content of the text' },
    color: { control: 'color', description: 'Color of the text' }, 
    weight: { control: 'number', description: 'Font weight of the text' },
  },
} as Meta<typeof PlayTypography>;

const Template: StoryFn<PlayTypographyProps> = (args) => <PlayTypography {...args} />;

export const Heading1 = Template.bind({});
Heading1.args = {
  variant: 'h1',
  children: 'Heading 1',
  
  
};

export const Heading2 = Template.bind({});
Heading2.args = {
  variant: 'h2',
  children: 'Heading 2',
  
};

export const Heading3 = Template.bind({});
Heading3.args = {
  variant: 'h3',
  children: 'Heading 3',
   
};

export const Paragraph = Template.bind({});
Paragraph.args = {
  variant: 'p',
  children: 'Paragraph Text',
  
};

export const SpanText = Template.bind({});
SpanText.args = {
  variant: 'span',
  children: 'Span Text',

};
