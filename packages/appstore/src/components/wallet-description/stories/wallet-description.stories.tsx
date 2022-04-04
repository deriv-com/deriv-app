import type { Meta, Story } from '@storybook/react';
import React from 'react';
import LinkedAppCard from '../index';

type LinkedAppCardProps = Parameters<typeof LinkedAppCard>[0];

export default {
    title: 'Appcard',
    parameters: { controls: { sort: 'alpha' } },
    argTypes: {
        size: {
            description: 'Optional. Controls the sizing of the app card.',
            control: {
                type: 'radio',
                options: ['small', 'medium', 'large'],
            },
            table: {
                type: { summary: '"small" | "medium" | "large" | undefined' },
                defaultValue: { summary: 'large' },
            },
        },
        checked: {
            description: 'Optional. App card is checked or not',
            defaultValue: false,
            table: {
                type: { summary: 'boolean | undefined' },
                defaultValue: { summary: false },
            },
        },
        // dark: {
        //     description: 'Optional. If set to `true`, the app card color will be set to dark theme.',
        //     defaultValue: false,
        //     table: {
        //         type: { summary: 'boolean | undefined' },
        //         defaultValue: { summary: false },
        //     },
        // },
        linked: {
            description: 'Required. If set to `true`, the app card will show linked app card template',
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
        disabled: {
            description:
                'Optional. If set to `true`, the wallet card opacity is set to 0.32. A disabled card has no hover effect and cannot be in active state.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean | undefined' },
                defaultValue: { summary: false },
            },
        },
        account_type: {
            description: 'Optional. Control the type of app-card',
            control: {
                type: 'radio',
                options: ['Real', 'Demo'],
            },
            table: {
                type: { summary: '"Real" | "Demo" | undefined' },
                defaultValue: { summary: 'Real' },
            },
        },
        app_card_details: {
            table: {
                wallet_name: new Text('Wallet Name'),
                wallet_icon: new Text('Wallet Icon'),
                currency_name: new Text('Currency'),
                balance: new Text('Balance'),
                app_name: new Text('App Name'),
                app_icon: new Text('App Icon'),
            },
        },
    },
} as Meta<LinkedAppCardProps>;

const Template: Story<LinkedAppCardProps> = args => <LinkedAppCard {...args} />;

export const DefaultUnlinkedLightLarge = Template.bind({});
DefaultUnlinkedLightLarge.args = {
    size: 'large',
    checked: false,
    // dark: false,
    // linked: false,
    faded: false,
    disabled: false,
    account_type: 'Real',
    app_card_details: {
        app_name: 'Deriv MT5 Synthetics',
        app_icon: 'icDxtradeSynthetic',
    },
};

export const DefaultUnlinkedLightMedium = Template.bind({});
DefaultUnlinkedLightMedium.args = {
    size: 'medium',
    checked: false,
    // dark: false,
    // linked: false,
    faded: false,
    disabled: false,
    account_type: 'Real',
    app_card_details: {
        app_name: 'Deriv MT5 Synthetics',
        app_icon: 'icDxtradeSynthetic',
    },
};

export const DefaultUnlinkedLightSmall = Template.bind({});
DefaultUnlinkedLightSmall.args = {
    size: 'small',
    checked: false,
    // dark: false,
    // linked: false,
    faded: false,
    disabled: false,
    account_type: 'Real',
    app_card_details: {
        app_name: 'Deriv MT5 Synthetics',
        app_icon: 'icDxtradeSynthetic',
    },
};

export const DefaultLinkedLightLarge = Template.bind({});
DefaultLinkedLightLarge.args = {
    size: 'large',
    checked: false,
    // dark: false,
    linked: true,
    faded: false,
    disabled: false,
    account_type: 'Real',
    app_card_details: {
        wallet_name: 'Real',
        wallet_icon: 'icAppstoreWalletUsdLight',
        currency_name: 'USD',
        balance: 10,
        app_name: 'Deriv MT5 Synthetics USD',
        app_icon: 'icDxtradeSynthetic',
    },
};

export const DefaultLinkedLightMedium = Template.bind({});
DefaultLinkedLightMedium.args = {
    size: 'medium',
    checked: false,
    // dark: false,
    linked: true,
    faded: false,
    disabled: false,
    account_type: 'Real',
    app_card_details: {
        wallet_name: 'Real',
        wallet_icon: 'icAppstoreWalletUsdLight',
        currency_name: 'USD',
        balance: 10,
        app_name: 'Deriv MT5 Synthetics USD',
        app_icon: 'icDxtradeSynthetic',
    },
};

export const DefaultLinkedLightSmall = Template.bind({});
DefaultLinkedLightSmall.args = {
    size: 'small',
    checked: false,
    // dark: false,
    linked: true,
    faded: false,
    disabled: false,
    account_type: 'Real',
    app_card_details: {
        wallet_name: 'Real',
        wallet_icon: 'icAppstoreWalletUsdLight',
        currency_name: 'USD',
        balance: 10,
        app_name: 'Deriv MT5 Synthetics USD',
        app_icon: 'icDxtradeSynthetic',
    },
};
