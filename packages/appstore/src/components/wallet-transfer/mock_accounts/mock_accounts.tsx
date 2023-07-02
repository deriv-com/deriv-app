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
            balance: '0.00',
            currency: 'USD',
            gradient_class: 'wallet-card__demo-bg',
            jurisdiction: <Badge label='Demo' type='contained' background_color='blue' />,
            icon: 'IcDxtradeDerived',
            label: name,
            loginid: idx.toString(),
            type: 'demo',
            wallet_icon: 'IcWalletDerivDemoLight',
        } as const)
);

const wallets = [
    {
        balance: '10,000.00',
        currency: 'USD',
        gradient_class: 'wallet-card__demo-bg',
        jurisdiction: <Badge label='Demo' type='contained' background_color='blue' />,
        label: 'Demo USD Wallet',
        loginid: '18',
        type: 'demo',
        wallet_icon: 'IcWalletDerivDemoLight',
    } as const,
];

export const transfer_accounts = { accounts, wallets };
