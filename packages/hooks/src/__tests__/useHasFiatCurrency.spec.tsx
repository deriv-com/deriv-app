import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasFiatCurrency from '../useHasFiatCurrency';
import { APIProvider } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    USD: { type: 'fiat', name: 'US Dollar' },
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                },
                p2p_config: { supported_currencies: ['usd'] },
            },
        },
    })),
}));

describe('useHasFiatCurrency', () => {
    test('should return false if client has no account', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useHasFiatCurrency(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if client has only BTC account', async () => {
        const mock = mockStore({ client: { account_list: [{ title: 'BTC' }] } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useHasFiatCurrency(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if client has only BTC account', async () => {
        const mock = mockStore({ client: { account_list: [{ title: 'BTC' }] } });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
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
            <APIProvider>
                <StoreProvider store={mock}>{children}</StoreProvider>
            </APIProvider>
        );

        const { result } = renderHook(() => useHasFiatCurrency(), { wrapper });

        expect(result.current).toBe(true);
    });
});
