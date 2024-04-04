import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useAccountTransferVisible from '../useAccountTransferVisible';

describe('useAccountTransferVisible', () => {
    test('should return false if residence is im', () => {
        const mock = mockStore({
            client: {
                residence: 'im',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useAccountTransferVisible(), { wrapper });

        expect(result.current).toBe(false);
    });

    test("should return false if doesn't have maltainvest account", () => {
        const mock = mockStore({
            client: {
                landing_company_shortcode: 'maltainvest',
                active_accounts: [{ landing_company_shortcode: 'svg' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useAccountTransferVisible(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if residence is not im and has maltainvest account', () => {
        const mock = mockStore({
            client: {
                residence: 'gb',
                landing_company_shortcode: 'svg',
                active_accounts: [{ landing_company_shortcode: 'maltainvest' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useAccountTransferVisible(), { wrapper });

        expect(result.current).toBe(true);
    });
});
