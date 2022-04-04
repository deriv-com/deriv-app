import React from 'react';
import type { Meta, Story } from '@storybook/react';
import CreateWallet from '../index';

type CreateWalletProps = Parameters<typeof CreateWallet>[0];

export default {
    title: 'CreateWallet',
    argTypes: {
        is_dark_mode_on: {
            description: 'Optional',
            type: 'boolean',
            defaultValue: false,
        },
        should_show_fiat: {
            description: 'Optional',
            type: 'boolean',
            defaultValue: false,
        },
    },
} as Meta<CreateWalletProps>;

const Template: Story<CreateWalletProps> = args => <CreateWallet {...args} />;

export const CreateWalletTemplate = Template.bind({});
CreateWalletTemplate.args = {};
