import React, { createContext, ReactNode } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { useSubscription } from '@deriv/api';

type TExchangeRatesContext = {
    handleSubscription: (base_currency: string, target_currency: string) => void;
    exchange_rates: TRate;
    rest: Omit<typeof useSubscription, 'subscribe' | 'data'>;
};

type TRate = Record<string, Record<string, number | number>>;

export const ExchangeRatesContext = createContext<TExchangeRatesContext | null>(null);

type TExchangeRatesProvider = {
    children: ReactNode;
};

const ExchangeRatesProvider = ({ children }: TExchangeRatesProvider) => {
    const [exchange_rates, setExchangeRates] = useLocalStorage<TRate>('exchange_rates', {});

    const { subscribe, data, ...rest } = useSubscription('exchange_rates');

    const handleSubscription = (base_currency: string, target_currency: string) => {
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
