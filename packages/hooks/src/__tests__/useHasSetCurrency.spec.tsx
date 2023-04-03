import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasSetCurrency from '../useHasSetCurrency';

describe('useHasSetCurrency', () => {
    test('should return true if user has no active real account', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useHasSetCurrency(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should return true if is_virtual is true', async () => {
        const mock = mockStore({
            client: {
                is_virtual: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useHasSetCurrency(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should return true account title is not Real ', async () => {
        const mock = mockStore({
            client: {
                account_list: [
                    {
                        title: 'Demo',
                        is_virtual: false,
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useHasSetCurrency(), { wrapper });

        expect(result.current).toBe(true);
    });
});
