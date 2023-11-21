import React from 'react';

import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';

import useWalletTransfer from '../useWalletTransfer';

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
                            account_type: 'wallet',
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

describe('useWalletTransfer', () => {
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

    it('from_account should be undefined by default', () => {
        const {
            result: {
                current: { from_account },
            },
        } = renderHook(() => useWalletTransfer(), { wrapper });

        expect(from_account).toBeUndefined();
    });
});
