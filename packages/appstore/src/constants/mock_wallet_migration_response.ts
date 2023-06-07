const mock_wallet_migration_response = [
    {
        title: 'Non-EU USD accounts',
        wallets: [
            {
                wallet_details: {
                    balance: 0,
                    currency: 'USD',
                    icon: 'IcCurrencyUsd',
                    icon_type: 'fiat',
                    jurisdiction_title: 'SVG',
                    name: 'USD',
                },
                account_list: [
                    {
                        balance: 1000,
                        currency: 'USD',
                        account_name: 'US Dollar',
                        icon: 'IcCurrencyUsd',
                        platform: 'deriv',
                    },
                    {
                        balance: 100,
                        currency: 'USD',
                        account_name: 'MT5 Derived SVG',
                        icon: 'IcRebrandingMt5DerivedDashboard',
                        platform: 'mt5',
                        sub_account_type: 'Derived',
                        landing_company_name: 'SVG',
                    },
                    {
                        balance: 123,
                        currency: 'USD',
                        account_name: 'MT5 Derived BVI',
                        icon: 'IcRebrandingMt5DerivedDashboard',
                        platform: 'mt5',
                        sub_account_type: 'Derived',
                        landing_company_name: 'BVI',
                    },
                    {
                        balance: 20,
                        currency: 'USD',
                        account_name: 'MT5 Derived Vanuata',
                        icon: 'IcRebrandingMt5DerivedDashboard',
                        platform: 'mt5',
                        sub_account_type: 'Derived',
                        landing_company_name: 'Vanuatu',
                    },
                    {
                        balance: 100,
                        currency: 'USD',
                        account_name: 'MT5 Financial SVG',
                        icon: 'IcRebrandingMt5FinancialDashboard',
                        platform: 'mt5',
                        sub_account_type: 'Financial',
                        landing_company_name: 'SVG',
                    },
                    {
                        balance: 100,
                        currency: 'USD',
                        account_name: 'MT5 Financial BVI',
                        icon: 'IcRebrandingMt5FinancialDashboard',
                        platform: 'mt5',
                        sub_account_type: 'Financial',
                        landing_company_name: 'SVG',
                    },
                    {
                        balance: 100,
                        currency: 'USD',
                        account_name: 'MT5 Financial Vanuatu',
                        icon: 'IcRebrandingMt5FinancialDashboard',
                        platform: 'mt5',
                        sub_account_type: 'Financial',
                        landing_company_name: 'SVG',
                    },
                    {
                        balance: 100,
                        currency: 'USD',
                        account_name: 'MT5 Financial Labuan',
                        icon: 'IcRebrandingMt5FinancialDashboard',
                        platform: 'mt5',
                        sub_account_type: 'Financial',
                        landing_company_name: 'SVG',
                    },
                    {
                        balance: 150,
                        currency: 'USD',
                        account_name: 'MT5 Swap-free',
                        icon: 'IcRebrandingMt5SwapFree',
                        platform: 'mt5',
                        sub_account_type: 'Swap-Free',
                    },
                    {
                        balance: 100,
                        currency: 'USD',
                        account_name: 'Deriv X',
                        icon: 'IcRebrandingDerivx',
                        platform: 'derivx',
                    },
                    {
                        balance: 100,
                        currency: 'USD',
                        account_name: 'Deriv EZ',
                        icon: 'IcDerivez',
                        platform: 'derivez',
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
                    balance: 0,
                    currency: 'USD',
                    icon: 'IcCurrencyUsd',
                    icon_type: 'fiat',
                    jurisdiction_title: 'MALTA',
                    name: 'USD',
                },
                account_list: [
                    {
                        balance: 1000,
                        currency: 'USD',
                        account_name: 'US Dollar',
                        icon: 'IcCurrencyUsd',
                        platform: 'deriv',
                    },
                    {
                        balance: 234,
                        currency: 'USD',
                        account_name: 'MT5 CFDs',
                        icon: 'IcRebrandingMt5Cfds',
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
                    balance: 0,
                    currency: 'BTC',
                    icon: 'IcCashierBitcoinLight',
                    icon_type: 'crypto',
                    jurisdiction_title: 'SVG',
                    name: 'Bitcoin',
                },
                account_list: [
                    {
                        balance: 0.00212012,
                        currency: 'BTC',
                        account_name: 'Bitcoin',
                        icon: 'IcCurrencyBtc',
                    },
                ],
            },
            {
                wallet_details: {
                    balance: 0,
                    currency: 'ETH',
                    icon: 'IcCashierEthereumLight',
                    icon_type: 'crypto',
                    jurisdiction_title: 'SVG',
                    name: 'Ethereum',
                },
                account_list: [
                    {
                        balance: 0.00212012,
                        currency: 'ETH',
                        account_name: 'Ethereum',
                        icon: 'IcCurrencyEth',
                    },
                ],
            },
            {
                wallet_details: {
                    balance: 0,
                    currency: 'USDC',
                    icon: 'IcCashierUsdCoinLight',
                    icon_type: 'crypto',
                    jurisdiction_title: 'SVG',
                    name: 'USD Coin',
                },
                account_list: [
                    {
                        balance: 0.00212012,
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
