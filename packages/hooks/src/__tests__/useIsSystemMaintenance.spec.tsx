import * as React from 'react';
import { StoreProvider, TStores } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useIsSystemMaintenance from '../useIsSystemMaintenance';
import { beforeEach } from '@jest/globals';

describe('useIsSystemMaintenance', () => {
    let mockRootStore: DeepPartial<TStores>;

    beforeEach(() => {
        mockRootStore = {
            client: {
                account_status: {
                    cashier_validation: [],
                },
            },
        };
    });

    test('should be false if there is no system_maintenance status', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsSystemMaintenance(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if if account_status is undefined', () => {
        mockRootStore.client!.account_status = undefined;
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsSystemMaintenance(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if there is system_maintenance status', () => {
        mockRootStore.client!.account_status!.cashier_validation!.push('system_maintenance');
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsSystemMaintenance(), { wrapper });

        expect(result.current).toBe(true);
    });
});
