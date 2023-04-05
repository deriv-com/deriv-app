import React, { useEffect } from 'react';
// import { useStore } from '../useStore';
import { useSubscription } from '@deriv/api';

const ExchangeRatesProvider = ({ children }: React.PropsWithChildren) => {
    const { data, subscribe, unsubscribe } = useSubscription('exchange_rates');
    // const {
    //     exchange_rates: { update },
    // } = useStore();

    // useEffect(() => {
    //     update(data);
    // }, [update, data]);

    useEffect(() => {
        subscribe({
            base_currency: 'USD',
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return <>{children}</>;
};

export default ExchangeRatesProvider;
