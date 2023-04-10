import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasSwapFreeAccount from '../useHasSwapFreeAccount';

describe('useHasSwapFreeAccount', () => {
    test('should be true if it has a market type of all', async () => {
        const mock = mockStore({
            client: {
                trading_platform_available_accounts: [{ market_type: 'all' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useHasSwapFreeAccount(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be false if it has a market type of financial', async () => {
        const mock = mockStore({
            client: {
                trading_platform_available_accounts: [{ market_type: 'financial' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useHasSwapFreeAccount(), { wrapper });

        expect(result.current).toBe(false);
    });
    test('should be false if has a market type of gaming ', async () => {
        const mock = mockStore({
            client: {
                trading_platform_available_accounts: [{ market_type: 'gaming' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useHasSwapFreeAccount(), { wrapper });

        expect(result.current).toBe(false);
    });
});
