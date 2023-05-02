import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasFiatCurrency from '../useHasFiatCurrency';

describe('useHasFiatCurrency', () => {
    test('should return false if client has no account', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasFiatCurrency(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if client has only BTC account', async () => {
        const mock = mockStore({
            client: {
                account_list: [{ title: 'BTC' }],
                is_crypto: jest.fn().mockReturnValue(true),
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasFiatCurrency(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if client has only BTC account', async () => {
        const mock = mockStore({
            client: {
                account_list: [{ title: 'BTC' }],
                is_crypto: jest.fn().mockReturnValue(true),
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasFiatCurrency(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if client has fiat account', async () => {
        const mock = mockStore({
            client: {
                account_list: [{ title: 'USD' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasFiatCurrency(), { wrapper });

        expect(result.current).toBe(true);
    });
});
