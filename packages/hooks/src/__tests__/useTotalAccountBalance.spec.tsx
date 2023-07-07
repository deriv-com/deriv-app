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

    test('should return total balance correctly when user has multiple accounts', async () => {
        const mock = mockStore({
            exchange_rates: {
                data: {
                    rates: {
                        EUR: 2,
                        AUD: 3,
                    },
                },
            },
            client: {
                active_accounts: [
                    {
                        currency: 'AUD',
                        balance: 300,
                    },
                    {
                        currency: 'EUR',
                        balance: 200,
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useTotalAccountBalance(mock.client.active_accounts), { wrapper });

        expect(result.current.balance).toBe(200);
    });
});
