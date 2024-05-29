import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useTotalAccountBalance from '../useTotalAccountBalance';

describe('useTotalAccountBalance', () => {
    test('should return zero when user has no account', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useTotalAccountBalance(mock.client.active_accounts), { wrapper });

        expect(result.current.balance).toBe(0);
    });

    test('should return total balance correctly when user has one account', () => {
        const mock = mockStore({
            client: {
                active_accounts: [
                    {
                        balance: 10000,
                        currency: 'USD',
                        account_type: 'real',
                    },
                ],
                getExchangeRate: () => 1,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useTotalAccountBalance(mock.client.active_accounts), { wrapper });
        expect(result.current.balance).toBe(10000);
    });

    test('should return total balance correctly when user has multiple accounts in same currency', () => {
        const mock = mockStore({
            client: {
                active_accounts: [
                    {
                        balance: 10000,
                        currency: 'USD',
                        account_type: 'demo',
                    },
                    {
                        balance: 10000,
                        currency: 'USD',
                        account_type: 'demo',
                    },
                ],
                getExchangeRate: () => 1,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useTotalAccountBalance(mock.client.active_accounts), { wrapper });
        expect(result.current.balance).toBe(20000);
    });

    // test('should return total balance correctly when user has multiple accounts in different currencies', () => {
    //     const mockedRates = {
    //         EUR: {
    //             USD: 2,
    //         },
    //         USD: {
    //             EUR: 0.5,
    //         },
    //     };
    //     window.localStorage.setItem('exchange_rates', JSON.stringify(mockedRates));

    //     const mock = mockStore({
    //         client: {
    //             active_accounts: [
    //                 {
    //                     balance: 100,
    //                     currency: 'USD',
    //                     account_type: 'demo',
    //                 },
    //                 {
    //                     balance: 200,
    //                     currency: 'EUR',
    //                     account_type: 'demo',
    //                 },
    //             ],
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>
    //             <ExchangeRatesProvider>{children}</ExchangeRatesProvider>
    //         </StoreProvider>
    //     );
    //     const { result } = renderHook(() => useTotalAccountBalance(mock.client.active_accounts), { wrapper });
    //     expect(result.current.balance).toBe(500);
    // });

    // test('should return total balance correctly when user has multiple accounts', async () => {
    //     const mockedRates = {
    //         AUD: {
    //             EUR: 2,
    //         },
    //         EUR: {
    //             AUD: 0.5,
    //         },
    //         USD: {
    //             EUR: 2,
    //             AUD: 1,
    //         },
    //     };
    //     window.localStorage.setItem('exchange_rates', JSON.stringify(mockedRates));

    //     const mock = mockStore({
    //         client: {
    //             active_accounts: [
    //                 {
    //                     currency: 'AUD',
    //                     balance: 300,
    //                 },
    //                 {
    //                     currency: 'EUR',
    //                     balance: 200,
    //                 },
    //             ],
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>
    //             <ExchangeRatesProvider>{children}</ExchangeRatesProvider>
    //         </StoreProvider>
    //     );
    //     const { result } = renderHook(() => useTotalAccountBalance(mock.client.active_accounts), { wrapper });
    //     expect(result.current.balance).toBe(400);
    // });
});
