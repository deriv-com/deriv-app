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
        description: localize('A better way to manage your funds'),
        bullets: [
            localize('One Wallet, one currency'),
            localize('A Wallet for each currency to focus your funds'),
            !eu_user && localize('Get one Wallet, get several - your choice'),
        ],
    },
    {
        icon: <WalletsImage banner='HowItWorks' />,
        title: localize('How it works'),
        description: localize('Get a Wallet, add funds, trade'),
        bullets: [
            localize('Get a Wallet for the currency you want'),
            localize('Add funds to your Wallet via your favourite payment method'),
            localize('Move funds to your trading account to start trading'),
        ],
    },
    {
        icon: <WalletsImage banner='TradingAccounts' />,
        title: localize('What happens to my trading accounts'),
        description: localize("We'll link them"),
        bullets: [
            localize("We'll connect your existing trading accounts of the same currency to your new Wallet"),
            !eu_user && localize('For example, all your USD trading account(s) will be linked to your USD Wallet'),
        ],
    },
];
