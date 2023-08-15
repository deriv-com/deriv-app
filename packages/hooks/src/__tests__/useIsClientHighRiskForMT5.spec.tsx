import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import useIsClientHighRiskForMT5 from '../useIsClientHighRiskForMT5';

describe('useIsClientHighRiskForMT5', () => {
    test('should return false if there are no financial accounts or synthetic accounts', () => {
        const mock = mockStore({
            client: {
                trading_platform_available_accounts: [],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsClientHighRiskForMT5(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if there are financial accounts but not of type svg', () => {
        const mock = mockStore({
            client: {
                trading_platform_available_accounts: [
                    {
                        market_type: 'financial',
                        shortcode: 'bvi',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsClientHighRiskForMT5(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if there are synthetic accounts but not of type svg', () => {
        const mock = mockStore({
            client: {
                trading_platform_available_accounts: [
                    {
                        market_type: 'gaming',
                        shortcode: 'bvi',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsClientHighRiskForMT5(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if there is one financial svg account and one synthetic svg account', () => {
        const mock = mockStore({
            client: {
                trading_platform_available_accounts: [
                    {
                        market_type: 'financial',
                        shortcode: 'svg',
                    },
                    {
                        market_type: 'gaming',
                        shortcode: 'svg',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsClientHighRiskForMT5(), { wrapper });

        expect(result.current).toBe(true);
    });
});
