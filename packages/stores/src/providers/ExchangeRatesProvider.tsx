import React, { useEffect } from 'react';
import { useSubscription } from '@deriv/api';
import merge from 'lodash.merge';
import useStore from '../useStore';

const ExchangeRatesProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const { is_loading, data, subscribe } = useSubscription('exchange_rates');
    const {
        exchange_rates: { update },
    } = useStore();

    useEffect(() => {
        subscribe({ payload: { base_currency: 'USD' } });
    }, [subscribe]);

    useEffect(() => {
        if (!is_loading && data) {
            const { exchange_rates } = data;

            if (exchange_rates) update(prev => merge(prev, exchange_rates));
        }
    }, [is_loading, update, data]);

    return <>{children}</>;
};

export default ExchangeRatesProvider;
