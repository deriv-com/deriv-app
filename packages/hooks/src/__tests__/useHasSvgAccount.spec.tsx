import * as React from 'react';
import { StoreProvider } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasSvgAccount from '../useHasSvgAccount';

describe('useHasSvgAccount', () => {
    test('should return true if client has SVG account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                active_accounts: [{ landing_company_shortcode: 'svg' }],
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useHasSvgAccount(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should return false if client has Maltainvest account', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                active_accounts: [{ landing_company_shortcode: 'maltainvest' }],
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useHasSvgAccount(), { wrapper });

        expect(result.current).toBe(false);
    });
});
