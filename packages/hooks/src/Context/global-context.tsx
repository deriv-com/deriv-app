import React, { createContext, ReactNode, useContext } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { useSubscription } from '@deriv/api';
// TODO: Add docs for this file

type TGlobalData = {
    handleSubscription: (base_currency: string, target_currency: string) => void;
    exchange_rates: TRate;
    rest: Omit<typeof useSubscription, 'subscribe' | 'data'>;
};

type TRate = {
    [k: string]: number;
};

const GlobalContext = createContext<TGlobalData | null>(null);

type TGlobalDataWrapperProps = {
    children: ReactNode;
};

const GlobalDataWrapper = ({ children }: TGlobalDataWrapperProps) => {
    const [exchange_rates, setExchangeRates] = useLocalStorage('exchange_rates', {});

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
            setExchangeRates((prev_rates: any) => {
                const base_currency = data?.exchange_rates?.base_currency || 'USD';

                // const new_rates = { ...prev_rates, ...(data?.exchange_rates?.rates || {}) };

                // (data?.exchange_rates?.rates || {})
                const new_rates = {
                    ...prev_rates,
                    ...{
                        [base_currency]: {
                            ...prev_rates[base_currency],
                            ...data?.exchange_rates?.rates,
                        },
                    },
                };
                return new_rates;
            });
        }
    }, [data, setExchangeRates]);

    return (
        <GlobalContext.Provider value={{ handleSubscription, exchange_rates, rest }}>{children}</GlobalContext.Provider>
    );
};

export const useGlobalData = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobalData must be used within a GlobalDataWrapper');
    }
    return context;
};

export default GlobalDataWrapper;
