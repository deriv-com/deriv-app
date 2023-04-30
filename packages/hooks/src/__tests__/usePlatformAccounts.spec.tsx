import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import usePlatformAccounts from '../usePlatformAccounts';

describe('usePlatformAccounts', () => {
    test('should return default currency when user has no account', async () => {
        const mock = mockStore({
            client: {
                account_list: [],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => usePlatformAccounts(), { wrapper });

        expect(result.current.demo).toBe(0);
    });

    // test('should return true if is_virtual is true', async () => {
    //     const mock = mockStore({
    //         client: {
    //             is_virtual: true,
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>{children}</StoreProvider>
    //     );
    //     const { result } = renderHook(() => useTotalAssetCurrency(), { wrapper });

    //     expect(result.current).toBe(true);
    // });

    // test('should return true account title is not Real ', async () => {
    //     const mock = mockStore({
    //         client: {
    //             account_list: [
    //                 {
    //                     title: 'Demo',
    //                     is_virtual: false,
    //                 },
    //             ],
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>{children}</StoreProvider>
    //     );
    //     const { result } = renderHook(() => useTotalAssetCurrency(), { wrapper });

    //     expect(result.current).toBe(true);
    // });
});
