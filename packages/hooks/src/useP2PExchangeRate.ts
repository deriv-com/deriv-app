import React from 'react';
import useExchangeRate from './useExchangeRate';

const useP2PExchangeRate = (local_currency: string) => {
    const { handleSubscription, exchange_rates } = useExchangeRate();

    React.useEffect(() => {
        handleSubscription('USD', local_currency);
    }, [handleSubscription, local_currency]);

    const exchange_rate = exchange_rates?.USD?.[local_currency] ?? 1;

    return exchange_rate;
};

export default useP2PExchangeRate;
