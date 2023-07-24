import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasSvgAccount from '../useHasSvgAccount';

describe('useHasSvgAccount', () => {
    test('should return true if client has SVG account', async () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ landing_company_shortcode: 'svg' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasSvgAccount(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should return false if client has Maltainvest account', async () => {
        const mock = mockStore({
            client: {
                active_accounts: [{ landing_company_shortcode: 'maltainvest' }],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useHasSvgAccount(), { wrapper });

        expect(result.current).toBe(false);
    });
});
