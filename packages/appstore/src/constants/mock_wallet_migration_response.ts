const mock_wallet_migration_response = [
    {
        title: 'Non-EU USD accounts',
        currency: 'USD',
        landing_company_name: 'svg',
        wallets: [
            {
                landing_company_name: 'svg',
                account_list: [
                    {
                        balance: '7.00',
                        currency: 'USD',
                        account_name: 'MT5 Derived SVG',
                        icon: 'IcRebrandingMt5Logo',
                    },
                    {
                        balance: '123.00',
                        currency: 'USD',
                        account_name: 'MT5 Derived BVI',
                        icon: 'IcRebrandingMt5Logo',
                    },
                ],
            },
        ],
    },
    {
        title: 'EU-regulated USD accounts',
        currency: 'USD',
        landing_company_name: 'malta',
        wallets: [
            {
                landing_company_name: 'svg',
                account_list: [
                    {
                        balance: '123.00',
                        currency: 'USD',
                        account_name: 'MT5 Financial SVG',
                        icon: 'IcRebrandingMt5Logo',
                    },
                    {
                        balance: '234.00',
                        currency: 'USD',
                        account_name: 'MT5 Derived Vanuata',
                        icon: 'IcRebrandingMt5Logo',
                    },
                ],
            },
        ],
    },
    {
        title: 'Cryptocurrency accounts',
        wallets: [
            {
                landing_company_name: 'svg',
                account_list: [
                    {
                        balance: '567.00',
                        currency: 'BTC',
                        account_name: 'Bitcoin',
                        icon: 'IcCurrencyBtc',
                    },
                ],
            },
            {
                landing_company_name: 'svg',
                account_list: [
                    {
                        balance: '89.00',
                        currency: 'ETH',
                        account_name: 'Ethereum',
                        icon: 'IcCurrencyEth',
                    },
                ],
            },
        ],
    },
];

export default mock_wallet_migration_response;
