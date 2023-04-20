import { useCallback } from 'react';
import { useStore } from '@deriv/stores';

/**
 * we can use this hook to get the exchange rate for the given currency.
 * exchange_rates comes from store and includes the rates for all currencies based on USD.
 */
const useExchangeRate = () => {
    const { exchange_rates } = useStore();
    const data = exchange_rates.data;
    const rates = data?.rates;

    const getRate = useCallback((currency: string) => rates?.[currency] || 1, [rates]);

    return {
        getRate,
        last_update: data?.date,
        base_currency: data?.base_currency || 'USD',
    };
};
export default useExchangeRate;
