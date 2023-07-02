import React from 'react';
import { Badge } from '@deriv/components';

// TODO: This mock_accounts file should be removed after connecting to API call

const trading_account_names = [
    'Deriv Apps Demo',
    'MT5 Derived Demo',
    'MT5 Financial Demo',
    'MT5 Swap-free Demo',
    'Deriv EZ Demo',
    'Deriv X Demo',
    'Deriv cTrader Demo',
    'Deriv EZ Demo',
    'Deriv X Demo',
    'Deriv cTrader Demo',
    'Deriv EZ Demo',
    'Deriv X Demo',
    'Deriv cTrader Demo',
    'Deriv cTrader Demo',
    'Deriv EZ Demo',
    'Deriv X Demo',
    'Deriv cTrader Demo',
];

const accounts = trading_account_names.map(
    (name, idx) =>
        ({
            loginid: idx.toString(),
            label: name,
            currency: 'USD',
            balance: '10.00',
            wallet_icon: 'IcCurrencyUsd',
            icon: 'IcDxtradeDerived',
            jurisdiction: <Badge label='Demo' type='contained' background_color='blue' />,
            type: 'fiat',
        } as const)
);

const wallets = [
    {
        loginid: '18',
        label: 'Demo USD Wallet',
        currency: 'USD',
        balance: '10000.00',
        wallet_icon: 'IcCurrencyUsd',
        jurisdiction: <Badge label='Demo' type='contained' background_color='blue' />,
        type: 'fiat',
    } as const,
];

export const transfer_accounts = { accounts, wallets };
