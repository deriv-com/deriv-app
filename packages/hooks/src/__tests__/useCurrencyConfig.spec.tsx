import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useCurrencyConfig from '../useCurrencyConfig';

describe('useCurrencyConfig', () => {
    test("should return undefined if the currency doesn't exist in currencies_config", () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useCurrencyConfig(), { wrapper });

        expect(result.current.getConfig('USD')).toBe(undefined);
    });

    test('should return currency config object for the given currency', () => {
        const mock = mockStore({
            website_status: {
                data: { currencies_config: { USD: { type: 'fiat', name: 'US Dollar' } } },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useCurrencyConfig(), { wrapper });

        expect(result.current.getConfig('USD')?.code).toBe('USD');
        expect(result.current.getConfig('USD')?.icon).toBe('IcCurrencyUsd');
        expect(result.current.getConfig('USD')?.is_fiat).toBe(true);
        expect(result.current.getConfig('USD')?.is_crypto).toBe(false);
        expect(result.current.getConfig('USD')?.is_USD).toBe(true);
    });
});
