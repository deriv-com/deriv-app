import { localize } from '@deriv/translations';

import { getWalletCurrencyIcon } from './utils';

const getMockWalletMigrationResponse = () => {
    return [
        {
            title: localize('Non-EU USD accounts'),
            wallets: [
                {
                    wallet_details: {
                        balance: 0,
                        currency: 'USD',
                        icon: getWalletCurrencyIcon('USD', false),
                        icon_type: 'fiat',
                        jurisdiction_title: 'SVG',
                        name: 'USD',
                        gradient_class: 'wallet-card__usd-bg',
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
                    ],
                },
            ],
        },
        {
            title: localize('EU-regulated USD accounts'),
            wallets: [
                {
                    wallet_details: {
                        balance: 0,
                        currency: 'USD',
                        icon: getWalletCurrencyIcon('USD', false),
                        icon_type: 'fiat',
                        jurisdiction_title: 'MALTA',
                        name: 'USD',
                        gradient_class: 'wallet-card__usd-bg',
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
            title: localize('Cryptocurrency accounts'),
            wallets: [
                {
                    wallet_details: {
                        balance: 0,
                        currency: 'BTC',
                        icon: getWalletCurrencyIcon('BTC', false),
                        icon_type: 'crypto',
                        jurisdiction_title: 'SVG',
                        name: 'Bitcoin',
                        gradient_class: 'wallet-card__btc-bg',
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
                        icon: getWalletCurrencyIcon('ETH', false),
                        icon_type: 'crypto',
                        jurisdiction_title: 'SVG',
                        name: 'Ethereum',
                        gradient_class: 'wallet-card__eth-bg',
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
                        icon: getWalletCurrencyIcon('USDC', false),
                        icon_type: 'crypto',
                        jurisdiction_title: 'SVG',
                        name: 'USD Coin',
                        gradient_class: 'wallet-card__usdc-bg',
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
};

export default getMockWalletMigrationResponse;
