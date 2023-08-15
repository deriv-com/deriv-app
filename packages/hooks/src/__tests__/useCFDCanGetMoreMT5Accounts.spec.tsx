import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import useCFDCanGetMoreMT5Accounts from '../useCFDCanGetMoreMT5Accounts';

describe('useCFDCanGetMoreMT5Accounts', () => {
    test('should return false if not real user', () => {
        const mock = mockStore({
            traders_hub: {
                is_eu_user: false,
                is_real: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useCFDCanGetMoreMT5Accounts(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if is EU user', () => {
        const mock = mockStore({
            traders_hub: {
                is_eu_user: true,
                is_real: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useCFDCanGetMoreMT5Accounts(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if no eligible account types', () => {
        const mock = mockStore({
            client: {
                isEligibleForMoreRealMt5: () => false,
            },
            traders_hub: {
                is_eu_user: false,
                is_real: true,
            },
            modules: {
                cfd: {
                    current_list: {},
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useCFDCanGetMoreMT5Accounts(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if high risk client for MT5', () => {
        const mock = mockStore({
            client: {
                isEligibleForMoreRealMt5: () => true,
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
            traders_hub: {
                is_eu_user: false,
                is_real: true,
            },
            modules: {
                cfd: {
                    current_list: {
                        'mt5.real.synthetic': {},
                        'mt5.real.financial': {},
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useCFDCanGetMoreMT5Accounts(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if eligible conditions are met', () => {
        const mock = mockStore({
            client: {
                isEligibleForMoreRealMt5: () => true,
            },
            traders_hub: {
                is_eu_user: false,
                is_real: true,
            },
            modules: {
                cfd: {
                    current_list: {
                        'mt5.real.synthetic': {},
                        'mt5.real.financial': {},
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useCFDCanGetMoreMT5Accounts(), { wrapper });

        expect(result.current).toBe(true);
    });
});
