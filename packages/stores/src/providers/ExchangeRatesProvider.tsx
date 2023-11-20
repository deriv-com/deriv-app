import React, { ReactNode } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useSubscription } from '@deriv/api';
import ExchangeRatesContext from '../stores/ExchangeRatesContext';

type TExchangeRatesProvider = {
    children: ReactNode;
};

type TRate = Record<string, Record<string, number>>;

const ExchangeRatesProvider = ({ children }: TExchangeRatesProvider) => {
    const [exchange_rates, setExchangeRates] = useLocalStorage<TRate>('exchange_rates', {});

    const { subscribe, data, ...rest } = useSubscription('exchange_rates');

    const handleSubscription = (base_currency: string, target_currency: string) => {
        if (base_currency === '' || target_currency === '' || base_currency === target_currency) return;
        subscribe({
            payload: {
                base_currency,
                target_currency,
            },
        });
    };

    React.useEffect(() => {
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
    }, [data, setExchangeRates]);

    return (
        <ExchangeRatesContext.Provider value={{ handleSubscription, exchange_rates, rest }}>
            {children}
        </ExchangeRatesContext.Provider>
    );
};

export default ExchangeRatesProvider;
