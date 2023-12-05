import React, { ReactNode, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
// import { useSubscription } from '@deriv/api';
import ExchangeRatesContext from '../stores/ExchangeRatesContext';
import useAPI from '@deriv/api/src/useAPI';

type TExchangeRatesProvider = {
    children: ReactNode;
};

type TRate = Record<string, Record<string, number>>;

const ExchangeRatesProvider = ({ children }: TExchangeRatesProvider) => {
    // const [exchange_rates, setExchangeRates] = useLocalStorage<TRate>('exchange_rates', {});
    const [exchange_rates, setExchangeRates] = useState<TRate>({});

    // const { subscribe, data, ...rest } = useSubscription('exchange_rates');
    const { subscribe } = useAPI();

    const handleSubscription = (base_currency: string, target_currency: string) => {
        const onData = response => {
            // console.log('response = ', response);
            const data = response?.exchange_rates;
            if (data) {
                setExchangeRates(prev_rates => {
                    const base_currency = data?.exchange_rates?.base_currency || 'USD';
                    const new_rates = {
                        ...prev_rates,
                        [base_currency]: {
                            ...prev_rates[base_currency],
                            ...data?.exchange_rates?.rates,
                        },
                    };
                    return new_rates;
                });
            }
        };

        const onError = response => {
            console.log('error = ', response);
        };

        if (base_currency === '' || target_currency === '' || base_currency === target_currency) return;
        // subscribe({
        //     // payload: {
        //     // base_currency,
        //     // target_currency,
        //     // },
        // });
        const payload = { base_currency, target_currency };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore it will be declared later
        subscribe('exchange_rates', { ...payload }).subscribe(onData, onError);
    };

    // React.useEffect(() => {
    //     if (data) {
    //         setExchangeRates(prev_rates => {
    //             const base_currency = data?.exchange_rates?.base_currency || 'USD';
    //             const new_rates = {
    //                 ...prev_rates,
    //                 [base_currency]: {
    //                     ...prev_rates[base_currency],
    //                     ...data?.exchange_rates?.rates,
    //                 },
    //             };
    //             return new_rates;
    //         });
    //     }
    // }, [data, setExchangeRates]);

    return (
        <ExchangeRatesContext.Provider value={{ handleSubscription, exchange_rates }}>
            {children}
        </ExchangeRatesContext.Provider>
    );
};

export default ExchangeRatesProvider;
