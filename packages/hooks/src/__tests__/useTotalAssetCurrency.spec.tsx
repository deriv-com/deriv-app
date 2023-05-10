import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useRealTotalAssetCurrency from '../useTotalAssetCurrency';

describe('useRealTotalAssetCurrency', () => {
    test('should return default currency when user has no account', async () => {
        const mock = mockStore({
            client: {
                default_currency: 'EUR',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });
        expect(result.current).toBe(mock.client.default_currency);
    });

    test('should return default currency when user has no real account', async () => {
        const mock = mockStore({
            client: {
                default_currency: 'EUR',
                accounts: {
                    acc1: {
                        currency: 'JPY',
                        is_virtual: 1,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });
        expect(result.current).toBe(mock.client.default_currency);
    });

    test('should return proper currency when user has non_crypto account', async () => {
        const mock = mockStore({
            client: {
                is_crypto: (currency: string) => currency === 'BTC',
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

        expect(result.current).toBe(mock.client.accounts.non_crypto_acc.currency);
    });

    test('should return empty string when user has non_crypto account with no currency set', async () => {
        const mock = mockStore({
            client: {
                is_crypto: (currency: string) => currency === 'BTC',
                accounts: {
                    crypto_acc: {
                        currency: 'BTC',
                        is_virtual: 0,
                    },
                    non_crypto_acc: {
                        is_virtual: 0,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

        expect(result.current).toBe('');
    });

    test("should return the first account's currency when user only has crypto account", async () => {
        const mock = mockStore({
            client: {
                is_crypto: (currency: string) => ['BTC', 'ETH'].includes(currency) || true,
                accounts: {
                    eth_acc: {
                        currency: 'ETH',
                        is_virtual: 0,
                    },
                    btc_acc: {
                        currency: 'BTC',
                        is_virtual: 0,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

        const first_account_currency = mock.client.accounts[Object.keys(mock.client.accounts)[0]].currency;
        expect(result.current).toBe(first_account_currency);
    });

    test('should return the current selected currency when user only has crypto account and is_crypto() is false', async () => {
        const mock = mockStore({
            client: {
                is_crypto: (currency: string) => ['BTC', 'ETH'].includes(currency) || false,
                currency: 'USDC',
                accounts: {
                    eth_acc: {
                        currency: 'ETH',
                        is_virtual: 0,
                    },
                    usdc_acc: {
                        currency: 'USDC',
                        is_virtual: 0,
                    },
                    btc_acc: {
                        currency: 'BTC',
                        is_virtual: 0,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

        expect(result.current).toBe(mock.client.currency);
    });

    test('should return undefined when user only has crypto account with no currency set', async () => {
        const mock = mockStore({
            client: {
                is_crypto: (currency: string) => ['BTC', 'ETH'].includes(currency) || true,
                accounts: {
                    crypto_acc: {
                        is_virtual: 0,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

        expect(result.current).toBe(undefined);
    });

    test("should return MF account's currency when user switch to eu account type", async () => {
        const mock = mockStore({
            traders_hub: {
                is_eu_user: true,
            },
            client: {
                current_fiat_currency: 'EUR',
                is_crypto: (currency: string) => ['BTC', 'ETH'].includes(currency) || true,
                accounts: {
                    btc_acc: {
                        currency: 'BTC',
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                    },
                    eth_acc: {
                        currency: 'ETH',
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                    },
                    MF1234: {
                        currency: 'EUR',
                        is_virtual: 0,
                        landing_company_shortcode: 'maltainvest',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

        expect(result.current).toBe(mock.client.accounts.MF1234.currency);
    });

    test("should return default currency when user switch to eu account type but MF account's currency is not set", async () => {
        const mock = mockStore({
            traders_hub: {
                is_eu_user: true,
            },
            client: {
                default_currency: 'GBP',
                is_crypto: (currency: string) => ['BTC', 'ETH'].includes(currency) || true,
                accounts: {
                    btc_acc: {
                        currency: 'BTC',
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                    },
                    eth_acc: {
                        currency: 'ETH',
                        is_virtual: 0,
                        landing_company_shortcode: 'svg',
                    },
                    MF1234: {
                        currency: 'EUR',
                        is_virtual: 0,
                        landing_company_shortcode: 'maltainvest',
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useRealTotalAssetCurrency(), { wrapper });

        expect(result.current).toBe(mock.client.default_currency);
    });
});
