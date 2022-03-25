import type { Meta, Story } from '@storybook/react';
import React from 'react';
import WalletCard from '../index';

type WalletCardProps = Parameters<typeof WalletCard>[0];

export default {
    title: 'WalletCard',
    parameters: { controls: { sort: 'alpha' } },
    argTypes: {
        active: {
            description:
                'Optional. If set to `true`, the wallet card border is highlighted in red by setting CSS "outline" property, and a check icon appears. Turned off for faded state.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean | undefined' },
                defaultValue: { summary: false },
            },
        },
        balance: {
            description: 'Optional. Sets the wallet balance.',
            defaultValue: undefined,
            table: {
                type: { summary: 'string | undefined' },
                defaultValue: { summary: undefined },
            },
        },
        currency: {
            description:
                'Optional. Sets the wallet currency. If undefined, a default currency will be applied: ' +
                'AUD for "aud" wallet, EUR for "eur" wallet, GBP for "gbp" wallet, USD for "usd"/"demo"/"deriv_p2p"/"payment_agent" wallets, ' +
                'BTC for "bitcoin", ETH for "ethereum", LTC for "litecoin", USDT for "tether", USDC for "usd_coin".',
            defaultValue: undefined,
            table: {
                type: { summary: 'string | undefined' },
                defaultValue: { summary: undefined },
            },
            control: {
                type: 'select',
                options: [
                    '', // required to clear currency and see the default one for each wallet_name
                    'AUD',
                    'EUR',
                    'GBP',
                    'USD',
                    'BTC',
                    'ETH',
                    'LTC',
                    'USDT',
                    'eUSDT',
                    'USDC',
                ],
            },
        },
        dark: {
            description: 'Optional. If set to `true`, the wallet card color will be set to dark theme.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean | undefined' },
                defaultValue: { summary: false },
            },
        },
        demo: {
            description:
                'Optional. If set to `true`, sets a special "demo" background. A control for it is disabled here intentionally. Please use the "demo" wallet_name instead.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean | undefined' },
                defaultValue: { summary: false },
            },
            control: false, // a "Demo" wallet can be selected by choosing the "demo" wallet_name
        },
        disabled: {
            description:
                'Optional. If set to `true`, the wallet card opacity is set to 0.32. A disabled card has no hover effect and cannot be in active state.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean | undefined' },
                defaultValue: { summary: false },
            },
        },
        faded: {
            description:
                'Optional. If set to `true`, the wallet card opacity is set to 0.72. A faded card has hover effect and can be in active state.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean | undefined' },
                defaultValue: { summary: false },
            },
        },
        size: {
            description: 'Optional. Controls the sizing of the wallet card.',
            control: {
                type: 'radio',
                options: ['small', 'medium', 'large'],
            },
            table: {
                type: { summary: '"small" | "medium" | "large" | undefined' },
                defaultValue: { summary: 'large' },
            },
        },
        wallet_name: {
            description: 'Required. Sets a wallet (payment method) name, logo and background color of the card.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: undefined },
            },
            control: {
                type: 'select',
                options: [
                    '[Name]', // non-existent, applies default color sheme and logo placeholder
                    'aud',
                    'bitcoin',
                    'demo',
                    'deriv_p2p',
                    'ethereum',
                    'eur',
                    'gbp',
                    'litecoin',
                    'payment_agent',
                    'tether',
                    'usd',
                    'usd_coin',
                ],
            },
        },
    },
} as Meta<WalletCardProps>;

const Template: Story<WalletCardProps> = args => <WalletCard {...args} />;

export const DefaultLightLarge = Template.bind({});
DefaultLightLarge.args = {
    active: false,
    balance: '0.00',
    currency: '[Currency]',
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'large',
    wallet_name: '[Name]',
};

export const DefaultLightMedium = Template.bind({});
DefaultLightMedium.args = {
    active: false,
    balance: '0.00',
    currency: '[Currency]',
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'medium',
    wallet_name: '[Name]',
};

export const DefaultLightSmall = Template.bind({});
DefaultLightSmall.args = {
    active: false,
    balance: '0.00',
    currency: '[Currency]',
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'small',
    wallet_name: '[Name]',
};

export const DefaultLightMediumWithoutBalance = Template.bind({});
DefaultLightMediumWithoutBalance.args = {
    active: false,
    balance: '',
    currency: undefined,
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'medium',
    wallet_name: '[Name]',
};

export const DefaultDarkMediumWithoutBalance = Template.bind({});
DefaultDarkMediumWithoutBalance.args = {
    active: false,
    balance: '',
    currency: undefined,
    dark: true,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'medium',
    wallet_name: '[Name]',
};

export const FiatCurrencyLightLarge = Template.bind({});
FiatCurrencyLightLarge.args = {
    active: false,
    balance: '50.00',
    currency: undefined,
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'large',
    wallet_name: 'usd',
};

export const FiatCurrencyLightSmall = Template.bind({});
FiatCurrencyLightSmall.args = {
    active: false,
    balance: '50.00',
    currency: undefined,
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'small',
    wallet_name: 'usd',
};

export const CryptoCurrencyLightLarge = Template.bind({});
CryptoCurrencyLightLarge.args = {
    active: false,
    balance: '50.00',
    currency: '[Currency]',
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'large',
    wallet_name: 'bitcoin',
};

export const CryptoCurrencyLightSmall = Template.bind({});
CryptoCurrencyLightSmall.args = {
    active: false,
    balance: '50.00',
    currency: 'BTC',
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'small',
    wallet_name: 'bitcoin',
};

export const DemoLightLarge = Template.bind({});
DemoLightLarge.args = {
    active: false,
    balance: '0.00',
    currency: undefined,
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'large',
    wallet_name: 'demo',
};

export const DemoLightSmall = Template.bind({});
DemoLightSmall.args = {
    active: false,
    balance: '0.00',
    currency: undefined,
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'small',
    wallet_name: 'demo',
};

export const ActiveLightLarge = Template.bind({});
ActiveLightLarge.args = {
    active: true,
    balance: '0.00',
    currency: '[Currency]',
    dark: false,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'large',
    wallet_name: '[Name]',
};

export const ActiveDarkMedium = Template.bind({});
ActiveDarkMedium.args = {
    active: true,
    balance: '0.00',
    currency: '[Currency]',
    dark: true,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'medium',
    wallet_name: '[Name]',
};

export const ActiveDarkSmall = Template.bind({});
ActiveDarkSmall.args = {
    active: true,
    balance: '0.00',
    currency: '[Currency]',
    dark: true,
    demo: undefined,
    disabled: false,
    faded: false,
    size: 'small',
    wallet_name: '[Name]',
};

export const FadedLightLarge = Template.bind({});
FadedLightLarge.args = {
    active: false,
    balance: '0.00',
    currency: '[Currency]',
    dark: false,
    demo: undefined,
    disabled: false,
    faded: true,
    size: 'large',
    wallet_name: '[Name]',
};

export const FadedDarkMedium = Template.bind({});
FadedDarkMedium.args = {
    active: false,
    balance: '0.00',
    currency: '[Currency]',
    dark: true,
    demo: undefined,
    disabled: false,
    faded: true,
    size: 'medium',
    wallet_name: '[Name]',
};

export const FadedDarkSmall = Template.bind({});
FadedDarkSmall.args = {
    active: false,
    balance: '0.00',
    currency: '[Currency]',
    dark: true,
    demo: undefined,
    disabled: false,
    faded: true,
    size: 'small',
    wallet_name: '[Name]',
};

export const DisabledLightLarge = Template.bind({});
DisabledLightLarge.args = {
    active: false,
    balance: '0.00',
    currency: '[Currency]',
    dark: false,
    demo: undefined,
    disabled: true,
    faded: false,
    size: 'large',
    wallet_name: '[Name]',
};

export const DisabledDarkMedium = Template.bind({});
DisabledDarkMedium.args = {
    active: false,
    balance: '0.00',
    currency: '[Currency]',
    dark: true,
    demo: undefined,
    disabled: true,
    faded: false,
    size: 'medium',
    wallet_name: '[Name]',
};

export const DisabledDarkSmall = Template.bind({});
DisabledDarkSmall.args = {
    active: false,
    balance: '0.00',
    currency: '[Currency]',
    dark: true,
    demo: undefined,
    disabled: true,
    faded: false,
    size: 'small',
    wallet_name: '[Name]',
};
