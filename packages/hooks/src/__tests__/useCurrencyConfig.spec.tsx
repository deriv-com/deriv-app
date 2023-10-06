import * as React from 'react';
import { APIProvider } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useCurrencyConfig from '../useCurrencyConfig';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'website_status') {
            return {
                data: {
                    website_status: {
                        currencies_config: {
                            AUD: { type: 'fiat', is_crypto: false },
                            BTC: { type: 'crypto', is_crypto: true },
                            ETH: { type: 'crypto', is_crypto: true },
                            UST: { type: 'crypto', is_crypto: true },
                            USD: { type: 'fiat', is_crypto: false, name: 'US Dollar' },
                            LTC: { type: 'crypto', is_crypto: true },
                        },
                    },
                },
            };
        }

        return { data: undefined };
    }),
}));

describe('useCurrencyConfig', () => {
    test("should return undefined if the currency doesn't exist in currencies_config", () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useCurrencyConfig(), { wrapper });

        expect(result.current.getConfig('EUR')).toBe(undefined);
    });

    test('should return currency config object for the given currency', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

        const { result } = renderHook(() => useCurrencyConfig(), { wrapper });

        expect(result.current.getConfig('USD')?.code).toBe('USD');
        expect(result.current.getConfig('USD')?.icon).toBe('IcCurrencyUsd');
        expect(result.current.getConfig('USD')?.is_fiat).toBe(true);
        expect(result.current.getConfig('USD')?.is_crypto).toBe(false);
        expect(result.current.getConfig('USD')?.is_USD).toBe(true);
    });
});
