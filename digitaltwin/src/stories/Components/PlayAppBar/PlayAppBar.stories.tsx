
import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import PlayAppBar, { PlayMenuBarProps, MenuItem }from "../../../components/atomic/PlayAppBar/PlayAppBar";
import { faUser, faHouse, faBars, faCircleInfo, faBuilding, faPeopleGroup, faUserTie } from '@fortawesome/free-solid-svg-icons';

export default {
  title: 'PlayAppBar',
  component: PlayAppBar,
  tags: ["autodocs"],
  argTypes: {
    menuItems: { control: { disable: true } }, 
    isMobile: { control: 'boolean' }, 
    logoSrc: { control: 'text' }, 
    title: { control: 'text' }, 
  },
} as Meta;

const Template: StoryFn<PlayMenuBarProps> = (args) => <PlayAppBar {...args} />;

const menuItems: MenuItem[] = [
  {
    label: "Home",
    icon: faHouse,
    link: '/home'
  },
  {
    label: "About",
    icon: faCircleInfo,
    link: '/about',
    dropdown: [
      {
        label: "Team",
        icon: faPeopleGroup,
        link: '/about/team'
      },
      {
        label: "Company",
        icon: faBuilding,
        link: '/about/company'
      },
      {
        label: "Employee",
        icon: faUserTie,
        link: '/about/employee'
      }
    ]
  },
  {
    label: "Contact",
    icon: faUser,
    link: '/contact'
  },
  {
    label: "Menu",
    icon: faBars,
    link: '/menu',
    dropdown: [
      {
        label: "Item 1",
        icon: faCircleInfo,
        link: '/menu/item1'
      },
      {
        label: "Item 2",
        icon: faCircleInfo,
        link: '/menu/item2'
      },
      {
        label: "Item 3",
        icon: faCircleInfo,
        link: '/menu/item3'
      },
      {
        label: "Item 4",
        icon: faCircleInfo,
        link: '/menu/item4'
      },
      {
        label: "Item 5",
        icon: faCircleInfo,
        link: '/menu/item5'
      }
    ]
  }
];

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
  logoSrc: '../logo.jpg', 
  menuItems: menuItems,
};

// export const MobileView = Template.bind({});
// MobileView.args = {
//   ...Default.args,
//   isMobile: true,
// };
