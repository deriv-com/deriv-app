import * as React from 'react';
import { StoreProvider, TStores } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useCashierLocked from '../useCashierLocked';
import { beforeEach } from '@jest/globals';

describe('useCashierLocked', () => {
    let mockRootStore: DeepPartial<TStores>;

    beforeEach(() => {
        mockRootStore = {
            client: {
                account_status: {
                    status: [],
                },
            },
        };
    });

    test('should be false if there is no cashier_locked status', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCashierLocked(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if account_status is undefined', () => {
        mockRootStore.client!.account_status = undefined;
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCashierLocked(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if there is cashier_locked status', () => {
        mockRootStore.client!.account_status!.status!.push('cashier_locked');
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCashierLocked(), { wrapper });

        expect(result.current).toBe(true);
    });
});
