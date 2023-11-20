import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import useIsAccountStatusPresent from '../useIsAccountStatusPresent';

describe('useIsAccountStatusPresent', () => {
    it('should return false when the status is not present', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    status: [],
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsAccountStatusPresent('cashier_locked'), { wrapper });

        expect(result.current).toBeFalsy();
    });

    it('should return true when the status is present', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    status: ['cashier_locked', 'unwelcome'],
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsAccountStatusPresent('cashier_locked'), { wrapper });

        expect(result.current).toBeTruthy();
    });
});
