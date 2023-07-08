import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useActiveWalletCFDAccounts from '../useActiveWalletCFDAccounts';
import { StoreProvider, mockStore } from '@deriv/stores';
import { APIProvider } from '@deriv/api';

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
                                    {
                                        loginid: 'EZR80001086',
                                        platform: 'derivez',
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
                        {
                            account_type: 'real',
                            balance: 0,
                            country: 'ng',
                            currency: 'USD',
                            display_balance: '0.00',
                            email: 'email@gmail.com',
                            group: 'real\\p02_ts01\\all\\svg_std-sf_usd',
                            landing_company_short: 'svg',
                            leverage: 1000,
                            login: 'MTR80057067',
                            market_type: 'all',
                            name: 'Name',
                            server: 'p02_ts01',
                            server_info: {
                                environment: 'Deriv-Server-02',
                                geolocation: {
                                    group: 'africa_derivez',
                                    location: 'South Africa',
                                    region: 'Africa',
                                    sequence: 2,
                                },
                                id: 'p02_ts01',
                            },
                            status: null,
                            sub_account_category: 'swap_free',
                            sub_account_type: 'standard',
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
                        {
                            account_type: 'real',
                            balance: 0,
                            country: 'za',
                            currency: 'USD',
                            display_balance: '0.00',
                            email: 'mei+za1@binary.com',
                            group: 'real\\p02_ts01\\all\\svg_ez_usd',
                            landing_company_short: 'svg',
                            leverage: 1000,
                            login: 'EZR80001086',
                            market_type: 'all',
                            name: 'Baily Pan',
                            server: 'p02_ts01',
                            server_info: {
                                environment: 'Deriv-Server-02',
                                geolocation: {
                                    group: 'africa_derivez',
                                    location: 'South Africa',
                                    region: 'Africa',
                                    sequence: 2,
                                },
                                id: 'p02_ts01',
                            },
                        },
                    ],
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('useActiveWalletCFDAccounts', () => {
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

    it('should return mt5, dxtrade and derivez accounts with extended properties', () => {
        const {
            result: {
                current: {
                    data: { mt5_accounts, derivez_accounts, dxtrade_accounts },
                },
            },
        } = renderHook(() => useActiveWalletCFDAccounts(), { wrapper });

        expect(mt5_accounts.length).toBe(2);
        mt5_accounts.forEach(account => {
            expect(account).toHaveProperty('loginid');
            expect(account).toHaveProperty('icon');
        });

        expect(derivez_accounts.length).toBe(1);
        mt5_accounts.forEach(account => {
            expect(account).toHaveProperty('loginid');
            expect(account).toHaveProperty('icon');
        });

        expect(dxtrade_accounts.length).toBe(1);
        mt5_accounts.forEach(account => {
            expect(account).toHaveProperty('loginid');
            expect(account).toHaveProperty('icon');
        });
    });
});
