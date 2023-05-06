import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasUSDCurrency from '../useHasUSDCurrency';

describe('useHasUSDCurrency', () => {
    test('should return false if client has no account', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasUSDCurrency(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if client has no USD account', async () => {
        const mock = mockStore({
            client: {
                account_list: [{ title: 'BTC' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasUSDCurrency(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if client has USD account', async () => {
        const mock = mockStore({
            client: {
                account_list: [{ title: 'USD' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasUSDCurrency(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should return true if client has at least one USD account', async () => {
        const mock = mockStore({
            client: {
                account_list: [{ title: 'BTC' }, { title: 'USD' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasUSDCurrency(), { wrapper });

        expect(result.current).toBe(true);
    });
});
