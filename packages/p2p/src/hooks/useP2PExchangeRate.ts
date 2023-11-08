import React from 'react';
import { useExchangeRate2 } from '@deriv/hooks';

const useP2PExchangeRate = (local_currency: string) => {
    const { handleSubscription, exchange_rates } = useExchangeRate2();

    React.useEffect(() => {
        handleSubscription('USD', local_currency);
    }, [handleSubscription, local_currency]);

    const exchange_rate = exchange_rates.USD[local_currency] || 1;

    return exchange_rate;
};

export default useP2PExchangeRate;
