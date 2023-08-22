import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useCashierLocked from '../useCashierLocked';

describe('useCashierLocked', () => {
    test('should be false if there is no cashier_locked status', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useCashierLocked(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if there is cashier_locked status', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    status: ['cashier_locked'],
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useCashierLocked(), { wrapper });

        expect(result.current).toBe(true);
    });
});
