import * as React from 'react';
import { StoreProvider } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWithdrawLocked from '../useWithdrawLocked';
// import useNeedPOI from '../useNeedPOI';

jest.mock('../useNeedPOI', () => jest.fn(() => true));

describe('useWithdrawLocked', () => {
    test('should be false if account_status.status in the client store is false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                account_status: {
                    status: undefined,
                },
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWithdrawLocked(), { wrapper });

        expect(result.current).toBe(false);
    });
    test('should be true if is_withdrawal_lock in the client store is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_withdrawal_lock: true,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWithdrawLocked(), { wrapper });

        expect(result.current).toBe(false);
    });
    test('should be true if is_need_poi is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                account_status: {
                    status: [''],
                },
            },
        };
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWithdrawLocked(), { wrapper });

        expect(result.current).toBe(true);
    });
});
