import React from 'react';
import useExchangeRate from './useExchangeRate';

const useP2PExchangeRate = (local_currency: string) => {
    const { handleSubscription, exchange_rates } = useExchangeRate();

    React.useEffect(() => {
        handleSubscription('USD', local_currency);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [local_currency]);

    const exchange_rate = exchange_rates?.USD?.[local_currency];

    return exchange_rate;
};

export default useP2PExchangeRate;
