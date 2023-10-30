/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import type { ExchangeRatesResponse } from '@deriv/api-types';

import useSubscription from '../useSubscription';

const useExchangeRates2 = () => {
    const { subscribe, unsubscribe, data, ...rest } = useSubscription('exchange_rates');

    useEffect(() => {
        return () => {
            unsubscribe();
            console.log('unsubscribed from exchange_rates');
        };
    }, [subscribe, unsubscribe]);

    return {
        subscribe,
        unsubscribe,
        data,
        ...rest,
    };
};

export default useExchangeRates2;
