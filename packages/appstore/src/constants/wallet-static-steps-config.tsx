import { localize } from '@deriv/translations';
import WalletsImage from 'Assets/wallets';
import React from 'react';

type TStep = {
    icon: JSX.Element;
    title: string;
    description: string;
    bullets: string[];
};

export const steps = (eu_user: boolean): TStep[] => [
    {
        icon: <WalletsImage banner={eu_user ? 'IntroducingWalletsEU' : 'IntroducingWallets'} />,
        title: localize('Introducing Wallets'),
        description: eu_user
            ? localize('A new way to manage your funds')
            : localize('A better way to manage your funds'),
        bullets: [
            eu_user ? localize('One Wallet for all your transactions') : localize('One Wallet, one currency'),
            eu_user
                ? localize('Keep track of your trading funds in one place')
                : localize('A Wallet for each currency to focus your funds'),
            !eu_user && localize('Get one Wallet, get several - your choice'),
        ],
    },
    {
        icon: <WalletsImage banner='HowItWorks' />,
        title: localize('How it works'),
        description: eu_user ? localize('Simply add your funds and trade') : localize('Get a Wallet, add funds, trade'),
        bullets: [
            !eu_user && localize('Get a Wallet for the currency you want'),
            localize('Add funds to your Wallet via your favourite payment method'),
            localize('Move funds to your trading account to start trading'),
        ],
    },
    {
        icon: <WalletsImage banner='TradingAccounts' />,
        title: localize('What happens to my trading accounts'),
        description: localize("We'll link them"),
        bullets: [
            eu_user
                ? localize("We'll connect your existing USD trading account(s) to your new USD Wallet ")
                : localize("We'll connect your existing trading accounts of the same currency to your new Wallet"),
            !eu_user && localize('For example, all your USD trading account(s) will be linked to your USD Wallet'),
        ],
    },
];
