/* eslint-disable no-console */
import React, { useContext } from 'react';
import { ExchangeRatesContext } from '@deriv/stores';

export const useExchangeRate2 = () => {
    const context = useContext(ExchangeRatesContext);

    if (!context) {
        throw new Error('useExchangeRate2 must be used within a ExchangeRatesProvider');
    }
    return context;
};

export default useExchangeRate2;
