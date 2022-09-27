import React from 'react';
import type { Meta, Story } from '@storybook/react';
import AddOptions from '../index';

type AddOptionsProps = Parameters<typeof AddOptions>;

export default {
    title: 'AddOptions',
} as Meta<AddOptionsProps>;

const Template: Story<AddOptionsProps> = args => <AddOptions numberofAccounts={4} />;

export const AppLauncherTemplate = Template.bind({});
