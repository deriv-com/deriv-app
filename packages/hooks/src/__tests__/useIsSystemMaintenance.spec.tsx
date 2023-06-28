import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useIsSystemMaintenance from '../useIsSystemMaintenance';

describe('useIsSystemMaintenance', () => {
    test('should be false if there is no system_maintenance status', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    cashier_validation: [],
                },
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsSystemMaintenance(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if account_status is undefined', () => {
        const mock = mockStore({
            client: {
                account_status: undefined,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsSystemMaintenance(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if there is system_maintenance status', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    cashier_validation: ['system_maintenance'],
                },
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsSystemMaintenance(), { wrapper });

        expect(result.current).toBe(true);
    });
});
