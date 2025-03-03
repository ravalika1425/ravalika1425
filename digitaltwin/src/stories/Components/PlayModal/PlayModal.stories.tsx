import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import PlayModal, { PlayModalProps } from '../../../components/atomic/PlayModal/PlayModal';

export default {
  title: 'PlayModal',
  component: PlayModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "PlayCard is a flexible card component for displaying content with optional headers and footers.",
      },
    },
  },
  argTypes: {
    children: { control: 'text', description: 'Content of the modal' },
  },
} as Meta;

const Template: StoryFn<PlayModalProps> = (args) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button onClick={handleOpen} className='play-open-modal'>Open Modal</button>
      <PlayModal isOpen={open} onClose={handleClose}>
        {args.children}
      </PlayModal>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <h2>This is a Modal</h2>
      <p>You can put any content here.</p>
    </>
  ),
};
