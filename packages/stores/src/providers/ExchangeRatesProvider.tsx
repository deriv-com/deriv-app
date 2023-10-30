import React, { useEffect } from 'react';
import { useSubscription } from '@deriv/api';
import merge from 'lodash.merge';
import { observer } from 'mobx-react-lite';
import useStore from '../useStore';

const ExchangeRatesProvider = observer(({ children }: React.PropsWithChildren<unknown>) => {
    const { data, subscribe, unsubscribe } = useSubscription('exchange_rates');
    const {
        exchange_rates: { update },
    } = useStore();

    useEffect(() => {
        subscribe({ payload: { base_currency: 'USD' } });

        return () => {
            unsubscribe();
        };
    }, [subscribe, unsubscribe]);

    useEffect(() => {
        if (data) {
            const { exchange_rates } = data;

            if (exchange_rates) update(prev => merge(prev, exchange_rates));
        }
    }, [update, data]);

    return <>{children}</>;
});

export default ExchangeRatesProvider;
