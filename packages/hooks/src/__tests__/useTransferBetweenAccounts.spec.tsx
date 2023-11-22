import React from 'react';

import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';

import useTransferBetweenAccounts from '../useTransferBetweenAccounts';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list: [
                            {
                                account_category: 'wallet',
                                account_type: 'doughflow',
                                created_at: 1688642811,
                                currency: 'USD',
                                is_disabled: 0,
                                is_selected: true,
                                is_virtual: 0,
                                landing_company_name: 'svg',
                                linked_to: [
                                    {
                                        loginid: 'MTR100967300',
                                        platform: 'mt5',
                                    },
                                    {
                                        loginid: 'MTR80057067',
                                        platform: 'mt5',
                                    },
                                    {
                                        loginid: 'DXR1646584',
                                        platform: 'dxtrade',
                                    },
                                ],
                                loginid: 'CRW1030',
                            },
                        ],
                        loginid: 'CRW1030',
                    },
                },
            };
        }
        if (name === 'mt5_login_list') {
            return {
                data: {
                    mt5_login_list: [
                        {
                            account_type: 'real',
                            balance: 0,
                            country: 'ng',
                            currency: 'USD',
                            display_balance: '0.00',
                            email: 'email@gmail.com',
                            group: 'real\\p02_ts02\\synthetic\\svg_std_usd\\04',
                            landing_company_short: 'svg',
                            leverage: 500,
                            login: 'MTR100967300',
                            market_type: 'synthetic',
                            name: 'Name',
                            server: 'p02_ts02',
                            server_info: {
                                environment: 'Deriv-Server-02',
                                geolocation: {
                                    group: 'africa_synthetic',
                                    location: 'South Africa',
                                    region: 'Africa',
                                    sequence: 2,
                                },
                                id: 'p02_ts02',
                            },
                            status: null,
                            sub_account_category: '',
                            sub_account_type: 'financial',
                        },
                    ],
                },
            };
        }
        if (name === 'trading_platform_accounts') {
            return {
                data: {
                    trading_platform_accounts: [
                        {
                            account_id: 'DXR1646584',
                            account_type: 'real',
                            balance: 0,
                            currency: 'USD',
                            display_balance: '0.00',
                            enabled: 1,
                            landing_company_short: 'svg',
                            login: '8807230',
                            market_type: 'all',
                            platform: 'dxtrade',
                        },
                    ],
                },
            };
        }
        if (name === 'website_status') {
            return {
                data: {
                    website_status: {
                        currencies_config: {
                            USD: {
                                fractional_digits: 2,
                                name: 'US Dollar',
                                type: 'fiat',
                            },
                        },
                    },
                },
            };
        }
        if (name === 'transfer_between_accounts') {
            return {
                data: {
                    accounts: [
                        {
                            account_category: 'wallet',
                            balance: '100.00',
                            currency: 'USD',
                            demo_account: 0,
                            loginid: 'CRW1030',
                        },
                        {
                            account_type: 'mt5',
                            balance: '0.00',
                            currency: 'USD',
                            demo_account: 0,
                            loginid: 'MTR100967300',
                        },
                        {
                            account_type: 'mt5',
                            balance: '0.00',
                            currency: 'USD',
                            demo_account: 0,
                            loginid: 'MTR80057067',
                        },
                        {
                            account_type: 'dxtrade',
                            balance: '0.00',
                            currency: 'USD',
                            demo_account: 0,
                            loginid: 'DXR1646584',
                        },
                    ],
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('useTransferBetweenAccounts', () => {
    let mock_store: ReturnType<typeof mockStore>, wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;

    beforeEach(() => {
        mock_store = mockStore({
            client: {
                loginid: 'CRW1030',
                accounts: {
                    CRW1030: {
                        token: 'token',
                    },
                },
            },
        });

        wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock_store}>{children}</StoreProvider>
            </APIProvider>
        );
    });

    it('should be correct amount of transfer accounts', () => {
        const {
            result: {
                current: { trading_accounts, wallet_accounts },
            },
        } = renderHook(() => useTransferBetweenAccounts(), { wrapper });

        expect(Object.keys(trading_accounts)).toHaveLength(3);
        expect(Object.keys(wallet_accounts)).toHaveLength(1);
    });

    it('all transfer accounts should have extended properties', () => {
        const {
            result: {
                current: { trading_accounts, wallet_accounts },
            },
        } = renderHook(() => useTransferBetweenAccounts(), { wrapper });

        Object.values({ ...trading_accounts, ...wallet_accounts }).forEach(account => {
            expect(account).toHaveProperty('active_wallet_icon');
            expect(account).toHaveProperty('display_currency_code');
            expect(account).toHaveProperty('gradient_class');
            expect(account).toHaveProperty('icon');
            expect(account).toHaveProperty('is_demo');
            expect(account).toHaveProperty('shortcode');
            expect(account).toHaveProperty('type');
        });
    });

    it('should return proper active account with extended properties', () => {
        const {
            result: {
                current: { active_wallet },
            },
        } = renderHook(() => useTransferBetweenAccounts(), { wrapper });

        expect(active_wallet).toEqual({
            account_category: 'wallet',
            active_wallet_icon: 'IcWalletCurrencyUsd',
            balance: 100,
            currency: 'USD',
            demo_account: 0,
            display_currency_code: 'USD',
            gradient_class: 'wallet-card__usd-bg',
            icon: 'IcWalletCurrencyUsd',
            is_demo: false,
            loginid: 'CRW1030',
            shortcode: 'svg',
            type: 'fiat',
        });
    });
});
