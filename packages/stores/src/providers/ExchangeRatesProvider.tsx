import React from 'react';
import merge from 'lodash.merge';
import { useSubscription } from '@deriv/api';
import useStore from '../useStore';

const ExchangeRatesProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const { data, subscribe } = useSubscription('exchange_rates');
    const {
        exchange_rates: { update },
    } = useStore();

    React.useEffect(() => {
        subscribe({ payload: { base_currency: 'USD' } });
    }, [subscribe]);

    React.useEffect(() => {
        if (data) update(prev => merge(prev, data));
    }, [update, data]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default ExchangeRatesProvider;
