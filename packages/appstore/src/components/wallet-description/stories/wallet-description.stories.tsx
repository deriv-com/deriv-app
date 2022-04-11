import type { Meta, Story } from '@storybook/react';
import React from 'react';
import WalletDescription from '../index';

export default {
    title: 'WalletDescription',
    parameters: { controls: { sort: 'alpha' } },
    argTypes: {},
} as Meta;

const Template: Story = args => <WalletDescription {...args} />;

export const DefaultWalletDescription = Template.bind({});
DefaultWalletDescription.args = {};
