import { useCallback, useState, useEffect } from 'react';
import { useStore } from '@deriv/stores';

/**
 * we can use this hook to get the exchange rate for the given currency.
 * exchange_rates comes from store and includes the rates for all currencies based on USD.
 */
const useExchangeRate = () => {
    const { exchange_rates } = useStore();
    const data = exchange_rates.data;
    const last_updated = data?.date;
    const rates = data?.rates;
    const [initialRates, setInitialRates] = useState<typeof rates>(undefined); //this is a static data which we can use for places like total asset to avoid showing user the real time value
    const [initialDate, setInitialDate] = useState<number | undefined>(undefined);
    //this is a static data which we can use for places like total asset to avoid showing user the real time value

    // console.log(last_updated, initialDate)
    useEffect(() => {
        if (rates) {
            if (!initialRates) setInitialRates(rates);
            if (!initialDate && last_updated) setInitialDate(last_updated);
        }

        if (last_updated && initialDate) {
            if (last_updated - initialDate > 20000) {
                setInitialRates(rates);
                setInitialDate(last_updated);
            }
        }
    }, [rates]);

    // we can have another useEffect to decide when or how we want to update the initialRates (eg, every x seconds)

    const getRate = useCallback((currency: string) => rates?.[currency] || 1, [rates]);

    const getInitialRates = useCallback((currency: string) => initialRates?.[currency] || 1, [initialRates]);

    return {
        getRate,
        getInitialRates,
        last_update: data?.date,
        base_currency: data?.base_currency || 'USD',
    };
};
export default useExchangeRate;
