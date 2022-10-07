import React from 'react';
import type { Meta, Story } from '@storybook/react';
import { localize } from '@deriv/translations';
import CreateWallet from 'Components/create-wallet';

type CreateWalletProps = Parameters<typeof CreateWallet>[0];

const wallets = [
    {
        getTitle: () => localize('Fiat currency wallets'),
        content: ['aud', 'eur', 'gbp', 'usd'],
        popover_text: () => localize('***'),
    },
    {
        getTitle: () => localize('Cryptocurrency wallets'),
        content: ['bitcoin', 'ethereum', 'litecoin', 'tether', 'usd_coin'],
        popover_text: () => '',
    },
    {
        getTitle: () => localize('Deriv P2P and Payment agents wallets'),
        content: ['deriv_p2p', 'payment_agent'],
        popover_text: () => '',
    },
];

const fiat_wallets = [
    {
        getTitle: () => localize('E-wallets'),
        content: [
            'airtm',
            'Fasapay',
            'Jeton',
            'Boleto',
            'Neteller',
            'PayLivre',
            'paysafecard',
            'Onlinenaira',
            'PerfectMoney',
            'Skrill',
            'Sticpay',
            'Astropay',
            'WechatPay',
            'Webmoney',
            'Beyonic',
            '1foryou',
            'Advcash',
        ],
        popover_text: () => '',
    },
    {
        getTitle: () => localize('Bankwire'),
        content: ['InstantBankTransfer', 'Paytrust88', 'Nganluong', 'Help2pay', 'Zingpay', 'Trustly', 'Oxxo', 'Spei'],
        popover_text: () => '',
    },
    { getTitle: () => localize('Credit/Debit card'), content: ['CreditCards'], popover_text: () => '' },
];

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
CreateWalletTemplate.args = {
    wallets,
    should_show_fiat: false,
};

export const CreateWalletTemplateWithShouldShowFiat = Template.bind({});
CreateWalletTemplateWithShouldShowFiat.args = {
    wallets: fiat_wallets,
    should_show_fiat: true,
};
