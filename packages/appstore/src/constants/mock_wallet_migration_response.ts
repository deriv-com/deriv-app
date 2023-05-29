const mock_wallet_migration_response = [
    {
        title: 'Non-EU USD accounts',
        wallets: [
            {
                wallet_details: {
                    balance: '0.00',
                    currency: 'USD',
                    icon: 'IcCurrencyUsd',
                    icon_type: 'fiat',
                    jurisdiction_title: 'SVG',
                    name: 'USD',
                },
                account_list: [
                    {
                        balance: '1000.00',
                        currency: 'USD',
                        account_name: 'US Dollar',
                        icon: 'IcCurrencyUsd',
                        platform: 'deriv',
                    },
                    {
                        balance: '100.00',
                        currency: 'USD',
                        account_name: 'MT5 Derived SVG',
                        icon: 'IcRebrandingMt5Logo',
                        platform: 'mt5',
                        sub_account_type: 'derived',
                        landing_company_name: 'SVG',
                    },
                    {
                        balance: '123.00',
                        currency: 'USD',
                        account_name: 'MT5 Derived BVI',
                        icon: 'IcRebrandingMt5Logo',
                        platform: 'mt5',
                        sub_account_type: 'derived',
                        landing_company_name: 'BVI',
                    },
                    {
                        balance: '100.00',
                        currency: 'USD',
                        account_name: 'MT5 Financial SVG',
                        icon: 'IcRebrandingMt5Logo',
                        platform: 'mt5',
                        sub_account_type: 'derived',
                        landing_company_name: 'SVG',
                    },
                    {
                        balance: '20.00',
                        currency: 'USD',
                        account_name: 'MT5 Derived Vanuata',
                        icon: 'IcRebrandingMt5Logo',
                        platform: 'mt5',
                        sub_account_type: 'derived',
                        landing_company_name: 'Vanuatu',
                    },
                    {
                        balance: '150.00',
                        currency: 'USD',
                        account_name: 'MT5 Swap-free',
                        icon: 'IcRebrandingMt5Logo',
                        platform: 'mt5',
                        sub_account_type: 'derived',
                    },
                    {
                        balance: '100.00',
                        currency: 'USD',
                        account_name: 'Deriv X',
                        icon: 'IcRebrandingMt5Logo',
                        platform: 'derivx',
                    },
                    {
                        balance: '100.00',
                        currency: 'USD',
                        account_name: 'Deriv EZ',
                        icon: 'IcRebrandingMt5Logo',
                        platform: 'derivez',
                    },
                    {
                        balance: '100.00',
                        currency: 'USD',
                        account_name: 'Deriv cTrader',
                        icon: 'IcRebrandingMt5Logo',
                        platform: 'ctrader',
                    },
                ],
            },
        ],
    },
    {
        title: 'EU-regulated USD accounts',
        wallets: [
            {
                wallet_details: {
                    balance: '0.00',
                    currency: 'USD',
                    icon: 'IcCurrencyUsd',
                    icon_type: 'fiat',
                    jurisdiction_title: 'MALTA',
                    name: 'USD',
                },
                account_list: [
                    {
                        balance: '1000.00',
                        currency: 'USD',
                        account_name: 'US Dollar',
                        icon: 'IcCurrencyUsd',
                        platform: 'deriv',
                    },
                    {
                        balance: '234.00',
                        currency: 'USD',
                        account_name: 'MT5 CFDs',
                        icon: 'IcRebrandingMt5Logo',
                        platform: 'mt5',
                    },
                ],
            },
        ],
    },
    {
        title: 'Cryptocurrency accounts',
        wallets: [
            {
                wallet_details: {
                    balance: '0.00',
                    currency: 'BTC',
                    icon: 'IcCashierBitcoinLight',
                    icon_type: 'crypto',
                    jurisdiction_title: 'SVG',
                    name: 'Bitcoin',
                },
                account_list: [
                    {
                        balance: '0.00212012',
                        currency: 'BTC',
                        account_name: 'Bitcoin',
                        icon: 'IcCurrencyBtc',
                    },
                ],
            },
            {
                wallet_details: {
                    balance: '0.00',
                    currency: 'ETH',
                    icon: 'IcCashierEthereumLight',
                    icon_type: 'crypto',
                    jurisdiction_title: 'SVG',
                    name: 'Ethereum',
                },
                account_list: [
                    {
                        balance: '0.00212012',
                        currency: 'ETH',
                        account_name: 'Ethereum',
                        icon: 'IcCurrencyEth',
                    },
                ],
            },
            {
                wallet_details: {
                    balance: '0.00',
                    currency: 'USDC',
                    icon: 'IcCashierUsdCoinLight',
                    icon_type: 'crypto',
                    jurisdiction_title: 'SVG',
                    name: 'USD Coin',
                },
                account_list: [
                    {
                        balance: '0.00212012',
                        currency: 'USDC',
                        account_name: 'USD Coin',
                        icon: 'IcCurrencyUsdc',
                    },
                ],
            },
        ],
    },
];

export default mock_wallet_migration_response;
