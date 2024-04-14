import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useExchangeRate from '../useExchangeRate';

describe('useExchangeRate', () => {
    test('should return undefined if currency is not found', async () => {
        const mock = mockStore({
            client: {
                exchange_rates: {
                    USD: {
                        EUR: 1.3,
                        GBP: 1.4,
                        ETH: 0.0001,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useExchangeRate(), { wrapper });
        const jyp_rate = result.current.exchange_rates.USD.JYP;
        expect(jyp_rate).toBe(undefined);
    });

    test('should return correct rate for the given currency other than USD', async () => {
        const mock = mockStore({
            client: {
                exchange_rates: {
                    USD: {
                        EUR: 1.3,
                        GBP: 1.4,
                        ETH: 0.0001,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useExchangeRate(), { wrapper });
        const gbp_rate = result.current.exchange_rates.USD.GBP;
        expect(gbp_rate).toBe(1.4);
    });
});
