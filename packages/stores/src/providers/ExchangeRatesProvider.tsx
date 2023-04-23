import React, { useEffect } from 'react';
import { useSubscription } from '@deriv/api';
import useStore from '../useStore';
import merge from 'lodash.merge';

const ExchangeRatesProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const { data, subscribe } = useSubscription('exchange_rates');
    const {
        exchange_rates: { update },
    } = useStore();

    useEffect(() => {
        subscribe({ payload: { base_currency: 'USD' } });
    }, [subscribe]);

    useEffect(() => {
        if (data) update(prev => merge(prev, data));
    }, [update, data]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default ExchangeRatesProvider;
