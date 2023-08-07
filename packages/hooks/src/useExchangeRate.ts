import { useCallback, useState, useEffect } from 'react';
import { useStore } from '@deriv/stores';

/**
 * we can use this hook to get the exchange rate for the given currency.
 * exchange_rates comes from store and includes the rates for all currencies based on USD.
 */
const useExchangeRate = () => {
    const { exchange_rates } = useStore();
    const data = exchange_rates.data;
    const rates = data?.rates;
    const [initialRate, setInitialRate] = useState<typeof rates>(undefined); //this is a static data which we can use for places like total asset to avoid showing user the real time value

    useEffect(() => {
        if (rates) {
            if (!initialRate) setInitialRate(rates);
        }
    }, [rates]);

    // we can have another useEffect to decide when or how we want to update the initialRate (eg, every x seconds)

    const getRate = useCallback((currency: string) => rates?.[currency] || 1, [rates]);

    const getInitialRate = useCallback((currency: string) => initialRate?.[currency] || 1, [initialRate]);

    return {
        getRate,
        getInitialRate,
        last_update: data?.date,
        base_currency: data?.base_currency || 'USD',
    };
};
export default useExchangeRate;
