import { useSubscription } from '@deriv/api';
import React, { createContext, ReactNode, useContext } from 'react';

type TGlobalData = {
    handleSubscription: (base_currency: string, target_currency: string) => void;
    conversion_rates: TRate;
    response_data: any;
};

type TRate = {
    [k: string]: number;
};

const GlobalContext = createContext<TGlobalData | null>(null);

type TGlobalDataWrapperProps = {
    children: ReactNode;
};

const GlobalDataWrapper = ({ children }: TGlobalDataWrapperProps) => {
    const [conversion_rates, setConversionRates] = React.useState<TRate>({});

    const { subscribe, unsubscribe, data, ...rest } = useSubscription('exchange_rates');

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
            setConversionRates(prev_rates => {
                const new_rates = { ...prev_rates, ...(data?.exchange_rates?.rates || {}) };
                return new_rates;
            });
        }
    }, [data]);

    return (
        <GlobalContext.Provider value={{ handleSubscription, conversion_rates, response_data: data }}>
            {children}
        </GlobalContext.Provider>
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
