import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useNeedPOI from '../useNeedPOI';
import useWithdrawLocked from '../useWithdrawLocked';

jest.mock('../useNeedPOI');

describe('useWithdrawLocked', () => {
    test('should be true if useNeedPOI is true', async () => {
        (useNeedPOI as jest.Mock).mockReturnValue(true);
        const mockRootStore = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWithdrawLocked(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be false if useNeedPOI is false', async () => {
        (useNeedPOI as jest.Mock).mockReturnValue(false);
        const mockRootStore = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWithdrawLocked(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if account_status.status is undefined or false', async () => {
        (useNeedPOI as jest.Mock).mockReturnValue(false);
        const mockRootStore = mockStore({
            client: {
                account_status: {
                    status: undefined,
                },
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWithdrawLocked(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if account_status.status includes withdrawal_locked', async () => {
        (useNeedPOI as jest.Mock).mockReturnValue(false);
        const mockRootStore = mockStore({
            client: {
                account_status: {
                    status: ['withdrawal_locked'],
                },
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWithdrawLocked(), { wrapper });

        expect(result.current).toBe(true);
    });
});
