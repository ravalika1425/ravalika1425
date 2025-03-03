import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import PlayProgressBar from '../../../components/atomic/PlayProgressBar/PlayProgressBar';

const meta: Meta<typeof PlayProgressBar> = {
  title: 'PlayProgressBar',
  component: PlayProgressBar,
  tags: ["autodocs"],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A progress bar component for displaying various types of progress.',
      },
    },
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['basic', 'dynamic', 'template', 'indeterminate'],
        description: 'The type of progress bar',
      },
    },
  },
};

export default meta;


const Template: StoryFn<typeof PlayProgressBar> = (args: any) => {
  return <PlayProgressBar {...args} />;
};


export const Basic = Template.bind({});
Basic.args = {
  type: 'basic',
  
};

export const Dynamic = Template.bind({});
Dynamic.args = {
  type: 'dynamic',
  
};

export const TemplateType = Template.bind({});
TemplateType.args = {
  type: 'template',
 
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  type: 'indeterminate',

};
