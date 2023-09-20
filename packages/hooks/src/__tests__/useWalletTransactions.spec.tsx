import * as React from 'react';
import { APIProvider, useFetch, usePaginatedFetch } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWalletTransactions from '../useWalletTransactions';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useCurrencyConfig: jest.fn(() => ({ getConfig: () => ({ code: 'USD', type: 'fiat' }) })),
    useFetch: jest.fn(),
    usePaginatedFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize'>>;
const mockUsePaginatedFetch = usePaginatedFetch as jest.MockedFunction<typeof usePaginatedFetch<'statement'>>;

const createWrapper = (mock: ReturnType<typeof mockStore>) => {
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <APIProvider>
            <StoreProvider store={mock}>{children}</StoreProvider>
        </APIProvider>
    );

    return wrapper;
};

describe('useWalletTransactions', () => {
    test('should return a list of transactions for a real wallet', () => {
        const mock = mockStore({
            client: {
                accounts: { CRW909900: { token: '12345' } },
                currency: 'USD',
                loginid: 'CRW909900',
            },
        });

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

        const { result } = renderHook(() => useWalletTransactions(), { wrapper: createWrapper(mock) });

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
        const mock = mockStore({
            client: {
                accounts: { CRW909900: { token: '12345' } },
                currency: 'USD',
                loginid: 'CRW909900',
            },
        });

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
            },
            isLoading: false,
            isSuccess: true,
        } as unknown as ReturnType<typeof mockUsePaginatedFetch>);

        const { result } = renderHook(() => useWalletTransactions(), { wrapper: createWrapper(mock) });

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
