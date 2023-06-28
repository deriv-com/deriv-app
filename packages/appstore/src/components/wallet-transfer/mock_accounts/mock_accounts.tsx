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
            gradient_class: 'wallet-card__demo-bg',
            balance: '0.00',
            wallet_icon: 'IcWalletDerivDemoLight',
            icon: 'IcDxtradeDerived',
            jurisdiction: <Badge label='Demo' type='contained' background_color='blue' />,
            type: 'demo',
        } as const)
);

const wallets = [
    {
        loginid: '18',
        label: 'Demo USD Wallet',
        currency: 'USD',
        gradient_class: 'wallet-card__demo-bg',
        balance: '10,000.00',
        wallet_icon: 'IcWalletDerivDemoLight',
        jurisdiction: <Badge label='Demo' type='contained' background_color='blue' />,
        type: 'demo',
    } as const,
];

export const transfer_accounts = { accounts, wallets };
