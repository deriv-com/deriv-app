import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasMaltaInvestAccount from '../useHasMaltaInvestAccount';

describe('useHasMaltaInvestAccount', () => {
    test('should return false if client has no account', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasMaltaInvestAccount(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return false if client has no malta invest account', () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ landing_company_shortcode: 'svg' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasMaltaInvestAccount(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if client has at least one malta invest account', () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ landing_company_shortcode: 'svg' }, { landing_company_shortcode: 'maltainvest' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasMaltaInvestAccount(), { wrapper });

        expect(result.current).toBe(true);
    });
});
