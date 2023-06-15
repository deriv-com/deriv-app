import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasCryptoCurrency from '../useHasCryptoCurrency';

describe('useHasCryptoCurrency', () => {
    test('should return false if client has no account', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasCryptoCurrency(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if client has no crypto account', async () => {
        const mock = mockStore({
            client: {
                account_list: [{ title: 'USD' }],
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasCryptoCurrency(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if client has crypto account', async () => {
        const mock = mockStore({
            client: {
                account_list: [{ title: 'BTC' }],
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasCryptoCurrency(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should return true if client has at least one crypto account', async () => {
        const mock = mockStore({
            client: {
                account_list: [{ title: 'BTC' }, { title: 'USD' }],
                is_crypto: (currency: string) => currency === 'BTC',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasCryptoCurrency(), { wrapper });

        expect(result.current).toBe(true);
    });
});
