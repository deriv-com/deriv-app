import * as React from 'react';

import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';

import useOnrampVisible from '../useOnrampVisible';

describe('useOnrampVisible', () => {
    test('returns false if onramp is not available for current currency', () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
                is_virtual: false,
                website_status: {
                    currencies_config: {
                        //@ts-expect-error we only need partial values
                        USD: { platform: { cashier: ['doughflow'], ramp: [] } },
                        //@ts-expect-error we only need partial values
                        BTC: { platform: { cashier: ['crypto'], ramp: ['ramp'] } },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useOnrampVisible(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('returns false if currency is not set', () => {
        const mock = mockStore({
            client: {
                currency: undefined,
                is_virtual: false,
                website_status: {
                    currencies_config: {
                        //@ts-expect-error we only need partial values
                        USD: { platform: { cashier: ['doughflow'], ramp: [] } },
                        //@ts-expect-error we only need partial values
                        BTC: { platform: { cashier: ['crypto'], ramp: ['ramp'] } },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useOnrampVisible(), { wrapper });

        expect(result.current).toBe(false);
    });

    test("returns false if client's account is virtual", () => {
        const mock = mockStore({
            client: {
                currency: 'USD',
                is_virtual: true,
                website_status: {
                    currencies_config: {
                        //@ts-expect-error we only need partial values
                        USD: { platform: { cashier: ['doughflow'], ramp: [] } },
                        //@ts-expect-error we only need partial values
                        BTC: { platform: { cashier: ['crypto'], ramp: ['ramp'] } },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useOnrampVisible(), { wrapper });

        expect(result.current).toBe(false);
    });

    test("returns true if onramp is available for current currency and client's account is not virtual", () => {
        const mock = mockStore({
            client: {
                currency: 'BTC',
                is_virtual: false,
                website_status: {
                    currencies_config: {
                        //@ts-expect-error we only need partial values
                        USD: { platform: { cashier: ['doughflow'], ramp: [] } },
                        //@ts-expect-error we only need partial values
                        BTC: { platform: { cashier: ['crypto'], ramp: ['ramp'] } },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useOnrampVisible(), { wrapper });

        expect(result.current).toBe(true);
    });
});
