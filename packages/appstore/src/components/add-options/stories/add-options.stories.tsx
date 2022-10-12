import React from 'react';
import type { Meta, Story } from '@storybook/react';
import AddOptions from '../index';

type AddOptionsProps = Parameters<typeof AddOptions>[0];

export default {
    title: 'AddOptions',
    argTypes: {
        number_of_accounts: {
            type: 'number',
            defaultValue: 4,
        },
        title: {
            type: 'string',
            defaultValue: 'title',
        },
        description: {
            type: 'string',
            defaultValue: 'description',
        },
    },
} as Meta<AddOptionsProps>;

const Template: Story<AddOptionsProps> = args => <AddOptions {...args} />;

export const AppLauncherTemplate = Template.bind({});
