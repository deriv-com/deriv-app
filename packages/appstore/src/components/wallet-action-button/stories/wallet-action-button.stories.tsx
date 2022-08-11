import type { Meta, Story } from '@storybook/react';
import React from 'react';
import WalletActionButton from '../index';

type WalletActionButtonProps = Parameters<typeof WalletActionButton>[0];

export default {
    title: 'WalletActionButton',
    component: WalletActionButton,
    argTypes: {
        icon: {
            defaultValue: 'icAppstoreTransfer',
            description: 'Optional. Icon for the button',
            control: {
                type: 'text',
            },
        },
        label: {
            defaultValue: 'Title',
            description: 'Optional. Label for the button',
            control: {
                type: 'text',
            },
        },
        size: {
            defaultValue: 'small',
            description: 'Optional. size for the button',
            control: {
                type: 'select',
                options: ['small', 'medium', 'large'],
            },
        },
    },
} as Meta<WalletActionButtonProps>;

const Template: Story<WalletActionButtonProps> = args => <WalletActionButton {...args} />;

export const WalletActionButtonTemplate = Template.bind({});
WalletActionButtonTemplate.args = {};
