import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useCurrencyExchangeRate from '../useCurrencyExchangeRate';

describe('useCurrencyExchangeRate', () => {
    test('should return 1 if currency is not found', async () => {
        const mock = mockStore({
            exchange_rates: {
                data: {
                    base_currency: 'USD',
                    rates: {
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
        const { result } = renderHook(() => useCurrencyExchangeRate('JPY'), { wrapper });
        expect(result.current).toBe(1);
    });

    test('should return correct rate for the given currency other than USD', async () => {
        const mock = mockStore({
            exchange_rates: {
                data: {
                    rates: {
                        EUR: 1.3,
                        GBP: 1.5,
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useCurrencyExchangeRate('EUR'), { wrapper });
        expect(result.current).toBe(1.3);
    });
});
