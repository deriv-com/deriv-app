import React from 'react';
import WalletsImage from 'Assets/svgs/wallets';
import { localize } from '@deriv/translations';

type TWalletIntroContent = {
    image: JSX.Element;
    title: string;
    description: string;
    bullets: string[];
};

const getWalletIntroContent = (is_eu: boolean): TWalletIntroContent[] => [
    {
        image: <WalletsImage image={is_eu ? 'introducing_wallets_eu' : 'introducing_wallets'} />,
        title: localize('Introducing Wallets'),
        description: is_eu ? localize('A new way to manage your funds') : localize('A better way to manage your funds'),
        bullets: [
            is_eu ? localize('One Wallet for all your transactions') : localize('One Wallet, one currency'),
            is_eu
                ? localize('Keep track of your trading funds in one place')
                : localize('A Wallet for each currency to focus your funds'),
            !is_eu &&
                localize('Get one Wallet, get several {{dash}} your choice', {
                    dash: '\u2014',
                }),
        ],
    },
    {
        image: <WalletsImage image='how_it_works' />,
        title: localize('How it works'),
        description: is_eu ? localize('Simply add your funds and trade') : localize('Get a Wallet, add funds, trade'),
        bullets: [
            !is_eu && localize('Get a Wallet for the currency you want'),
            localize('Add funds to your Wallet via your favourite payment method'),
            localize('Move funds to your trading account to start trading'),
        ],
    },
    {
        image: <WalletsImage image={is_eu ? 'trading_accounts_eu' : 'trading_accounts'} />,
        title: localize('What happens to my trading accounts'),
        description: localize("We'll link them"),
        bullets: [
            is_eu
                ? localize("We'll connect your existing USD trading account(s) to your new USD Wallet ")
                : localize("We'll connect your existing trading accounts of the same currency to your new Wallet"),
            !is_eu && localize('For example, all your USD trading account(s) will be linked to your USD Wallet'),
        ],
    },
];

export default getWalletIntroContent;
