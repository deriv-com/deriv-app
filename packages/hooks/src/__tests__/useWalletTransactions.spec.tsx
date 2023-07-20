import * as React from 'react';
import { APIProvider, useFetch, usePaginatedFetch } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWalletTransactions from '../useWalletTransactions';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(),
    usePaginatedFetch: jest.fn(),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'authorize'>>;
const mockUsePaginatedFetch = usePaginatedFetch as jest.MockedFunction<typeof usePaginatedFetch<'statement'>>;

describe('useWalletTransactions', () => {
    test('should return a list of transactions', () => {
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
                            is_virtual: 0,
                            loginid: 'CRW909900',
                        },
                    ],
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
                            action_type: 'reset_balance',
                            amount: 350,
                            balance_after: 10000,
                            transaction_id: 13693003421,
                            transaction_time: 1685942133,
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
            },
            isLoading: false,
            isSuccess: true,
        } as unknown as ReturnType<typeof mockUsePaginatedFetch>);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useWalletTransactions(), { wrapper });

        expect(result.current.transactions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    account_category: 'wallet',
                    account_currency: 'USD',
                    account_type: 'doughflow',
                    action_type: 'deposit',
                    amount: 25,
                    balance_after: 25,
                    gradient_card_class: 'wallet-card__usd-bg',
                    icon: 'IcWalletCurrencyUsd',
                    icon_type: 'fiat',
                    transaction_id: 17494415481,
                    transaction_time: 1685942136,
                }),
                expect.objectContaining({
                    account_category: 'wallet',
                    account_currency: 'USD',
                    account_type: 'doughflow',
                    action_type: 'withdrawal',
                    amount: 750,
                    balance_after: 0,
                    gradient_card_class: 'wallet-card__usd-bg',
                    icon: 'IcWalletCurrencyUsd',
                    icon_type: 'fiat',
                    transaction_id: 17494415480,
                    transaction_time: 1685942135,
                }),
                expect.objectContaining({
                    account_category: 'wallet',
                    account_currency: 'USD',
                    account_type: 'doughflow',
                    action_type: 'reset_balance',
                    amount: 350,
                    balance_after: 10000,
                    gradient_card_class: 'wallet-card__usd-bg',
                    icon: 'IcWalletCurrencyUsd',
                    icon_type: 'fiat',
                    transaction_id: 13693003421,
                    transaction_time: 1685942133,
                }),
                expect.objectContaining({
                    account_category: 'wallet',
                    account_currency: 'USD',
                    account_type: 'doughflow',
                    action_type: 'deposit',
                    amount: 1000,
                    balance_after: 1000,
                    gradient_card_class: 'wallet-card__usd-bg',
                    icon: 'IcWalletCurrencyUsd',
                    icon_type: 'fiat',
                    transaction_id: 17494117539,
                    transaction_time: 1685942131,
                }),
            ])
        );
    });
});
