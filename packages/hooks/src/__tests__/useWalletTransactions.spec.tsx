import * as React from 'react';
import { APIProvider, useFetch, usePaginatedFetch } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useWalletTransactions from '../useWalletTransactions';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
    usePaginatedFetch: jest.fn(),
    // useFetch: jest.fn((name: string) => {
    //     if (name === 'balance') {
    //         return {
    //             data: {
    //                 balance: {
    //                     accounts: {
    //                         CRW000000: {
    //                             balance: 100,
    //                         },
    //                     },
    //                 },
    //             },
    //         };
    //     }
    //     if (name === 'authorize') {
    //         return {
    //             data: {
    //                 authorize: {
    //                     account_list: [
    //                         {
    //                             loginid: 'CRW000000',
    //                             account_category: 'wallet',
    //                             is_virtual: 0,
    //                             landing_company_name: 'maltainvest',
    //                             currency: 'USD',
    //                         },
    //                         {
    //                             loginid: 'MXN000000',
    //                             account_category: 'trading',
    //                             is_virtual: 0,
    //                             landing_company_name: 'maltainvest',
    //                             currency: 'BTC',
    //                         },
    //                     ],
    //                     loginid: 'CRW000000',
    //                 },
    //             },
    //         };
    //     }

    //     return { data: undefined };
    // }),
    // usePaginatedFetch: jest.fn((name: string) => {
    //     if (name === 'balance') {
    //         return {
    //             data: {
    //                 balance: {
    //                     accounts: {
    //                         CRW000000: {
    //                             balance: 100,
    //                         },
    //                     },
    //                 },
    //             },
    //         };
    //     }
    //     if (name === 'authorize') {
    //         return {
    //             data: {
    //                 authorize: {
    //                     account_list: [
    //                         {
    //                             loginid: 'CRW000000',
    //                             account_category: 'wallet',
    //                             is_virtual: 0,
    //                             landing_company_name: 'maltainvest',
    //                             currency: 'USD',
    //                         },
    //                         {
    //                             loginid: 'MXN000000',
    //                             account_category: 'trading',
    //                             is_virtual: 0,
    //                             landing_company_name: 'maltainvest',
    //                             currency: 'BTC',
    //                         },
    //                     ],
    //                     loginid: 'CRW000000',
    //                 },
    //             },
    //         };
    //     }

    //     return { data: undefined };
    // }),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize'>>;
const mockUsePaginatedFetch = usePaginatedFetch as jest.MockedFunction<typeof usePaginatedFetch<'statement'>>;

describe('useWalletTransactions', () => {
    test('should return a list of transactions for a real wallet', () => {
        // const mock = mockStore({
        //     client: {
        //         accounts: { CRW909900: { token: '12345' } },
        //         currency: 'USD',
        //         loginid: 'CRW909900',
        //     },
        // });

        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        {
                            account_category: 'wallet',
                            account_type: 'doughflow',
                            currency: 'USD',
                            is_selected: true,
                            is_virtual: 0,
                            loginid: 'CRW909900',
                        },
                    ],
                },
                website_status: {
                    currencies_config: {
                        USD: { type: 'fiat' },
                    },
                },
            },
            isLoading: false,
            isSuccess: true,
        } as unknown as ReturnType<typeof mockUseFetch>);

        mockUsePaginatedFetch.mockReturnValue({
            data: {
                statement: {
                    transactions: [
                        {
                            action_type: 'deposit',
                            amount: 25,
                            balance_after: 25,
                            transaction_id: 17494415481,
                            transaction_time: 1685942136,
                        },
                        {
                            action_type: 'withdrawal',
                            amount: 750,
                            balance_after: 0,
                            transaction_id: 17494415480,
                            transaction_time: 1685942135,
                        },
                        {
                            action_type: 'deposit',
                            amount: 1000,
                            balance_after: 1000,
                            transaction_id: 17494117539,
                            transaction_time: 1685942131,
                        },
                    ],
                },
                website_status: {
                    currencies_config: {
                        USD: {
                            fractional_digits: 2,
                            is_deposit_suspended: 0,
                            is_suspended: 0,
                            is_withdrawal_suspended: 0,
                            name: 'US Dollar',
                            stake_default: 10,
                            type: 'fiat',
                        },
                    },
                },
            },
            isLoading: false,
            isSuccess: true,
        } as unknown as ReturnType<typeof mockUsePaginatedFetch>);

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useWalletTransactions(), { wrapper });

        expect(result.current.transactions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    account_category: 'wallet',
                    account_currency_config: expect.objectContaining({
                        code: 'USD',
                        type: 'fiat',
                    }),
                    account_type: 'doughflow',
                    action_type: 'deposit',
                    amount: 25,
                    balance_after: 25,
                    transaction_id: 17494415481,
                    transaction_time: 1685942136,
                }),
                expect.objectContaining({
                    account_category: 'wallet',
                    account_currency_config: expect.objectContaining({
                        code: 'USD',
                        type: 'fiat',
                    }),
                    account_type: 'doughflow',
                    action_type: 'withdrawal',
                    amount: 750,
                    balance_after: 0,
                    transaction_id: 17494415480,
                    transaction_time: 1685942135,
                }),
                expect.objectContaining({
                    account_category: 'wallet',
                    account_currency_config: expect.objectContaining({
                        code: 'USD',
                        type: 'fiat',
                    }),
                    account_type: 'doughflow',
                    action_type: 'deposit',
                    amount: 1000,
                    balance_after: 1000,
                    transaction_id: 17494117539,
                    transaction_time: 1685942131,
                }),
            ])
        );
    });

    test('should return a list of transactions for a demo wallet', () => {
        // const mock = mockStore({
        //     client: {
        //         accounts: { CRW909900: { token: '12345' } },
        //         currency: 'USD',
        //         loginid: 'CRW909900',
        //     },
        // });

        mockUseFetch.mockReturnValue({
            data: {
                authorize: {
                    account_list: [
                        {
                            account_category: 'wallet',
                            account_type: 'virtual',
                            currency: 'USD',
                            is_selected: true,
                            is_virtual: 1,
                            loginid: 'CRW909900',
                        },
                    ],
                },
                website_status: {
                    currencies_config: {
                        USD: { type: 'fiat' },
                    },
                },
            },
            isLoading: false,
            isSuccess: true,
        } as unknown as ReturnType<typeof mockUseFetch>);

        // TODO: revisit action_type once BE clarifies its values for demo wallets
        mockUsePaginatedFetch.mockReturnValue({
            data: {
                statement: {
                    transactions: [
                        {
                            action_type: 'virtual_credit',
                            amount: 10000,
                            balance_after: 10000,
                            transaction_id: 17494415481,
                            transaction_time: 1685942136,
                        },
                        {
                            action_type: 'virtual_credit',
                            amount: 10000,
                            balance_after: 10000,
                            transaction_id: 13693003421,
                            transaction_time: 1685942133,
                        },
                        {
                            action_type: 'virtual_credit',
                            amount: 10000,
                            balance_after: 10000,
                            transaction_id: 17494117539,
                            transaction_time: 1685942131,
                        },
                    ],
                },
                website_status: {
                    currencies_config: {
                        USD: {
                            fractional_digits: 2,
                            is_deposit_suspended: 0,
                            is_suspended: 0,
                            is_withdrawal_suspended: 0,
                            name: 'US Dollar',
                            stake_default: 10,
                            type: 'fiat',
                        },
                    },
                },
            },
            isLoading: false,
            isSuccess: true,
        } as unknown as ReturnType<typeof mockUsePaginatedFetch>);

        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useWalletTransactions(), { wrapper });

        expect(result.current.transactions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    account_category: 'wallet',
                    account_currency_config: expect.objectContaining({
                        code: 'USD',
                        type: 'fiat',
                    }),
                    account_type: 'virtual',
                    action_type: 'virtual_credit',
                    amount: 10000,
                    balance_after: 10000,
                    transaction_id: 17494415481,
                    transaction_time: 1685942136,
                }),
                expect.objectContaining({
                    account_category: 'wallet',
                    account_currency_config: expect.objectContaining({
                        code: 'USD',
                        type: 'fiat',
                    }),
                    account_type: 'virtual',
                    action_type: 'virtual_credit',
                    amount: 10000,
                    balance_after: 10000,
                    transaction_id: 13693003421,
                    transaction_time: 1685942133,
                }),
                expect.objectContaining({
                    account_category: 'wallet',
                    account_currency_config: expect.objectContaining({
                        code: 'USD',
                        type: 'fiat',
                    }),
                    account_type: 'virtual',
                    action_type: 'virtual_credit',
                    amount: 10000,
                    balance_after: 10000,
                    transaction_id: 17494117539,
                    transaction_time: 1685942131,
                }),
            ])
        );
    });
});
