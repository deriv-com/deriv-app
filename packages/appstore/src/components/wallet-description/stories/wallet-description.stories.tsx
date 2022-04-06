import type { Meta, Story } from '@storybook/react';
import React from 'react';
import WalletDescription from '../index';

type WalletDescriptionProps = Parameters<typeof WalletDescription>[0];

export default {
    title: 'WalletDescription',
    parameters: { controls: { sort: 'alpha' } },
    argTypes: {
        wallet_name: {
            description: 'Optional. Controls the description of wallet.',
            control: {
                type: 'select',
                options: ['aud', 'eur', 'gbp', 'usd', 'bitcoin', 'ethereum' , 'litecoin', 'tether', 'usd_coin', 'deriv_p2p', 'payment_agent'],
            },
            table: {
                type: { summary: ' string | undefined' },
                defaultValue: { summary: 'eur' },
            },
        },
    },
} as Meta<WalletDescriptionProps>;

const Template: Story<WalletDescriptionProps> = args => <WalletDescription {...args} />;

export const DefaultWalletDescription = Template.bind({});
DefaultWalletDescription.args = {
    wallet_name: 'eur',
};