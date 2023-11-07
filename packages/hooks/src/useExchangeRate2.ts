import React, { useContext } from 'react';
import { ExchangeRatesContext } from './Context/global-context';

export const useExchangeRate2 = () => {
    const context = useContext(ExchangeRatesContext);

    if (!context) {
        throw new Error('useExchangeRate2 must be used within a ExchangeRatesDataWrapper');
    }
    return context;
};

export default useExchangeRate2;
