import type { Meta, Story } from '@storybook/react';
import React from 'react';
import CardsLink from '../index';
import AppStoreAppCard from '../../app-card';
import AppStoreWalletCard from '../../wallet';

type CardsLinkProps = Parameters<typeof CardsLink>[0];

const app_card_details = {
    app_card_details: {
        wallet_name: 'Real',
        wallet_icon: 'icAppstoreWalletUsdLight',
        currency_name: 'USD',
        balance: 10,
        app_name: 'Deriv MT5 Synthetics USD',
        app_icon: 'icDxtradeSynthetic',
    },
};

export default {
    title: 'CardsLinks',
    parameters: { controls: { sort: 'alpha' } },
    argTypes: {
        is_linked: {
            description: 'Required. If set to `true`, the app card and the wallet card will be shown linked',
            defaultValue: false,
            table: {
                type: { summary: 'boolean | undefined' },
                defaultValue: { summary: false },
            },
        },
    },
} as Meta<CardsLinkProps>;

const Template: Story<CardsLinkProps> = args => <CardsLink {...args} />;

export const BothCardsNotPassed = Template.bind({});

BothCardsNotPassed.args = {
    is_linked: false,
};

export const OnlyAppCardPassed = Template.bind({});

OnlyAppCardPassed.args = {
    is_linked: false,
    app_card: <AppStoreAppCard size='large' account_type='Real' {...app_card_details} linked />,
};

export const OnlyWalletCardPassed = Template.bind({});

OnlyWalletCardPassed.args = {
    is_linked: false,
    wallet_card: <AppStoreWalletCard size='large' wallet_name='aud' />,
};

export const AppCardWalletCardNotLinked = Template.bind({});

AppCardWalletCardNotLinked.args = {
    is_linked: false,
    app_card: <AppStoreAppCard size='large' account_type='Real' {...app_card_details} linked />,
    wallet_card: <AppStoreWalletCard size='large' wallet_name='aud' />,
};

export const AppCardWalletCardLinked = Template.bind({});

AppCardWalletCardLinked.args = {
    is_linked: true,
    app_card: <AppStoreAppCard size='large' account_type='Real' {...app_card_details} linked />,
    wallet_card: <AppStoreWalletCard size='large' wallet_name='aud' />,
};
