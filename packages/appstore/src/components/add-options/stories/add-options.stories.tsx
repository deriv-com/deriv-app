import React from 'react';
import type { Meta, Story } from '@storybook/react';
import AddOptions from '../index';

type AddOptionsProps = Parameters<typeof AddOptions>[0];

export default {
    title: 'AddOptions',
    argTypes: {
        title: {
            type: 'string',
            defaultValue: 'More Options accounts',
        },
        description: {
            type: 'string',
            defaultValue: 'Including cryptocurrencies',
        },
        class_names: {
            type: 'string',
            defaultValue: '',
        },
    },
} as Meta<AddOptionsProps>;

const Template: Story<AddOptionsProps> = args => <AddOptions {...args} />;

export const AppLauncherTemplate = Template.bind({});
