import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useIsRealAccountNeededForCashier from '../useIsRealAccountNeededForCashier';

describe('useIsRealAccountNeededForCashier', () => {
    test('should return false if user is not in real account', async () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ landing_company_shortcode: 'svg' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsRealAccountNeededForCashier(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if user has no real account', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsRealAccountNeededForCashier(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if client is in real and has a real account', async () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ landing_company_shortcode: 'maltainvest' }],
            },
            traders_hub: {
                is_real: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsRealAccountNeededForCashier(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should return false if client has svg and maltainvest account', async () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ landing_company_shortcode: 'maltainvest' }, { landing_company_shortcode: 'svg' }],
            },
            traders_hub: {
                is_real: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsRealAccountNeededForCashier(), { wrapper });

        expect(result.current).toBe(false);
    });
});
