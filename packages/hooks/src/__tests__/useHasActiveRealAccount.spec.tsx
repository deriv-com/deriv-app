import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasActiveRealAccount from '../useHasActiveRealAccount';

describe('useHasActiveRealAccount', () => {
    test('should return false if client has no account', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasActiveRealAccount(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if client has only virtual account', () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ is_virtual: 1 }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasActiveRealAccount(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if client has real account', () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ is_virtual: 0 }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasActiveRealAccount(), { wrapper });

        expect(result.current).toBe(true);
    });
});
