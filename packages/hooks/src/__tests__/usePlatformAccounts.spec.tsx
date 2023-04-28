import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useTotalAssetCurrency from '../useTotalAssetCurrency';

describe('useTotalAssetCurrency', () => {
    test('should return default currency when user has no account', async () => {
        const mock = mockStore({
            client: {
                account_list: [],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useTotalAssetCurrency(), { wrapper });

        expect(result.current).toBe('USD');
    });

    test('should return proper currency when user has non_crypto account', async () => {
        const mock = mockStore({
            client: {
                accounts: {
                    loginid: {
                        currency: 'EUR',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useTotalAssetCurrency(), { wrapper });

        expect(result.current).toBe('EUR');
    });

    // test('should return empty string when user has not set currency for non_crypto account', async () => {}

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
