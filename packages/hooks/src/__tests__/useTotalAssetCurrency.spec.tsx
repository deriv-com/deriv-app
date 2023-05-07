import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useRealTotalAssetCurrency from '../useTotalAssetCurrency';

describe('useRealTotalAssetCurrency', () => {
    // test('should return default currency when user has no account', async () => {
    //     const mock = mockStore({
    //         client: {
    //             default_currency: 'EUR',
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>{children}</StoreProvider>
    //     );
    //     const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });
    //     expect(result.current).toBe('EUR');
    // });

    // test('should return default currency when user has no real account', async () => {
    //     const mock = mockStore({
    //         client: {
    //             default_currency: 'EUR',
    //             accounts: {
    //                 acc1: {
    //                     currency: 'JPY',
    //                     is_virtual: 1,
    //                 },
    //             },
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>{children}</StoreProvider>
    //     );
    //     const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });
    //     expect(result.current).toBe('EUR');
    // });

    test('should return proper currency when user has non_crypto account', async () => {
        const mock = mockStore({
            client: {
                is_crypto: jest.fn(),
                accounts: {
                    crypto_acc: {
                        currency: 'BTC',
                        is_virtual: 0,
                    },
                    non_crypto_acc: {
                        currency: 'AUD',
                        is_virtual: 0,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

        expect(result.current).toBe('AUD');
    });

    // test('should return empty string when user has non_crypto account with no currency set', async () => {
    //     const mock = mockStore({
    //         client: {
    //             is_crypto: false,
    //             accounts: {
    //                 non_crypto_acc: {
    //                     is_virtual: 0,
    //                 },
    //             },
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>{children}</StoreProvider>
    //     );
    //     const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

    //     expect(result.current).toBe('');
    // });

    // test('should return proper currency when user only has crypto account', async () => {
    //     const mock = mockStore({
    //         client: {
    //             is_crypto: true,
    //             accounts: {
    //                 crypto_acc: {
    //                     currency: 'USDC',
    //                     is_virtual: 0,
    //                 },
    //             },
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>{children}</StoreProvider>
    //     );
    //     const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

    //     expect(result.current).toBe('USDC');
    // });

    // test('should return empty string when user only has crypto account with no currency set', async () => {
    //     const mock = mockStore({
    //         client: {
    //             is_crypto: true,
    //             accounts: {
    //                 crypto_acc: {
    //                     is_virtual: 0,
    //                 },
    //             },
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>{children}</StoreProvider>
    //     );
    //     const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

    //     expect(result.current).toBe('');
    // });

    // test('should return proper currency when eu user only has crypto account', async () => {
    //     const mock = mockStore({
    //         client: {
    //             is_crypto: false,
    //             is_eu: false,
    //             accounts: {
    //                 crypto_acc: {
    //                     currency: 'BTC',
    //                     is_virtual: 0,
    //                 },
    //                 non_crypto_acc: {
    //                     currency: 'EUR',
    //                     is_virtual: 1,
    //                 },
    //             },
    //         },
    //     });

    //     const wrapper = ({ children }: { children: JSX.Element }) => (
    //         <StoreProvider store={mock}>{children}</StoreProvider>
    //     );
    //     const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

    //     expect(result.current).toBe('USDC');
    // });
});
