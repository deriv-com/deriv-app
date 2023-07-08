import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWalletsList from '../useWalletsList';

const account_list = [
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
];

const currencies_config = {
    AUD: {
        fractional_digits: 2,
        name: 'Australian Dollar',
        type: 'fiat',
    },
    USD: {
        fractional_digits: 2,
        name: 'US Dollar',
        type: 'fiat',
    },
    EUR: {
        fractional_digits: 2,
        name: 'Euro',
        type: 'fiat',
    },
    BTC: {
        fractional_digits: 8,
        name: 'Bitcoin',
        type: 'crypto',
    },
    ETH: {
        fractional_digits: 8,
        name: 'Ethereum',
        type: 'crypto',
    },
    UST: {
        fractional_digits: 2,
        name: 'Tether Omni',
        type: 'crypto',
    },
};

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list,
                    },
                },
            };
        }
        if (name === 'website_status') {
            return {
                data: {
                    website_status: {
                        currencies_config,
                    },
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('useWalletsList', () => {
    test('should return wallets list for the current loginid', () => {
        const mock = mockStore({
            client: {
                accounts: { CRW1030: { token: '12345' } },
                currency: 'USD',
                loginid: 'CRW1030',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useWalletsList(), { wrapper });

        expect(result.current.data).toEqual([
            {
                ...account_list[0],
                account_category: 'wallet',
                balance: 0,
                currency: 'USD',
                display_currency_code: 'USD',
                gradient_card_class: 'wallet-card__usd-bg',
                gradient_header_class: 'wallet-header__usd-bg',
                is_added: true,
                landing_company_name: 'svg',
                icon: 'IcWalletCurrencyUsd',
                is_crypto: false,
                is_demo: false,
                is_malta_wallet: false,
                is_selected: true,
                is_virtual: false,
                name: 'USD Wallet',
                is_disabled: false,
            },
        ]);
    });

    test('should return empty array if there is no wallets list', () => {
        const mock = mockStore({
            client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' },
        });

        (useFetch as jest.Mock).mockImplementation((name: string) => {
            if (name === 'authorize') {
                return {
                    data: {
                        authorize: {
                            account_list: [],
                        },
                    },
                };
            }
            if (name === 'website_status') {
                return { data: { website_status: { currencies_config } } };
            }

            return { data: undefined };
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useWalletsList(), { wrapper });

        expect(result.current.data).toEqual([]);
    });

    // test('should return alphabetically sorted wallet list based on currency', () => {
    //     const mock = mockStore({
    //         client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' },
    //     });

    //     // @ts-expect-error Need to update @deriv/api-types to fix the TS error
    //     mockUseFetch.mockReturnValue({
    //         data: {
    //             authorize: {
    //                 account_list: [
    //                     {
    //                         account_category: 'wallet',
    //                         currency: 'USD',
    //                         is_virtual: 0,
    //                     },
    //                     {
    //                         account_category: 'wallet',
    //                         currency: 'UST',
    //                         is_virtual: 0,
    //                     },
    //                     {
    //                         account_category: 'wallet',
    //                         currency: 'BTC',
    //                         is_virtual: 0,
    //                     },
    //                     {
    //                         account_category: 'wallet',
    //                         currency: 'AUD',
    //                         is_virtual: 0,
    //                     },
    //                 ],
    //             },
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <APIProvider>
    //             <StoreProvider store={mock}>{children}</StoreProvider>
    //         </APIProvider>
    //     );

    //     const { result } = renderHook(() => useWalletsList(), { wrapper });

    //     expect(result.current.data?.map(wallet => wallet.currency)).toEqual(['AUD', 'BTC', 'USD', 'UST']);
    // });

    test('should return sorted wallet list where virtual is the last and crypto is after fiat currency', () => {
        const mock = mockStore({
            client: {
                accounts: { CRW909900: { token: '12345' } },
                loginid: 'CRW909900',
            },
        });

        (useFetch as jest.Mock).mockImplementation((name: string) => {
            if (name === 'authorize') {
                return {
                    data: {
                        authorize: {
                            account_list: [
                                {
                                    account_category: 'wallet',
                                    currency: 'USD',
                                    is_virtual: 0,
                                },
                                {
                                    account_category: 'wallet',
                                    currency: 'UST',
                                    is_virtual: 0,
                                },
                                {
                                    account_category: 'wallet',
                                    currency: 'BTC',
                                    is_virtual: 1,
                                },
                                {
                                    account_category: 'wallet',
                                    currency: 'AUD',
                                    is_virtual: 0,
                                },
                                {
                                    account_category: 'wallet',
                                    currency: 'ETH',
                                    is_virtual: 0,
                                },
                            ],
                        },
                    },
                };
            }
            if (name === 'website_status') {
                return { data: { website_status: { currencies_config } } };
            }

            return { data: undefined };
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useWalletsList(), { wrapper });

        expect(result.current.data?.map(wallet => wallet.currency)).toEqual(['AUD', 'USD', 'ETH', 'UST', 'BTC']);
    });
});
