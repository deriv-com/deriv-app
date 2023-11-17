import { createContext } from 'react';

import { useSubscription } from '@deriv/api';

type TRate = Record<string, Record<string, number>>;

type TExchangeRatesContext = {
    handleSubscription: (base_currency: string, target_currency: string) => void;
    exchange_rates: TRate;
    rest: Omit<typeof useSubscription, 'subscribe' | 'data'>;
};

const ExchangeRatesContext = createContext<TExchangeRatesContext | null>(null);

export default ExchangeRatesContext;
