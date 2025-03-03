import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import PlayLoader, { PlayLoaderProps } from '../../../components/atomic/PlayLoader/PlayLoader';

export default {
  title: 'PlayLoader',
  component: PlayLoader,
  tags: ["autodocs"],
  args: {
    products: [],
    loadMore: () => {},
  },
  argTypes: {
    products: { control: 'array' },
    loadMore: { action: 'clicked' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'PlayLoader is a component to display a list of products with an option to load more.',
      },
    },
  },
} as Meta;

const Template: StoryFn<PlayLoaderProps> = (args) => <PlayLoader {...args} />;

export const Default = Template.bind({});

// export const WithProducts = Template.bind({});
// WithProducts.args = {
//   products: [
//     {
//       id: '1',
//       name: 'Product 1',
//       description: 'Description of Product 1',
//       category: 'Category 1',
//       price: 10,
//       inventoryStatus: 'INSTOCK',
//     },
//     {
//       id: '2',
//       name: 'Product 2',
//       description: 'Description of Product 2',
//       category: 'Category 2',
//       price: 20,
//       inventoryStatus: 'LOWSTOCK',
//     },
//     {
//       id: '3',
//       name: 'Product 3',
//       description: 'Description of Product 3',
//       category: 'Category 3',
//       price: 30,
//       inventoryStatus: 'OUTOFSTOCK',
//     },
//   ],
// };

export const WithLoadButton: StoryFn<PlayLoaderProps> = (args) => <PlayLoader {...args} />;
WithLoadButton.args = {
  // products: args.products,
};
