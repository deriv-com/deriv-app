/* eslint-disable no-console */
import { useContext } from 'react';
import { ExchangeRatesContext } from '@deriv/stores';

export const useExchangeRate = () => {
    const context = useContext(ExchangeRatesContext);

    if (!context) {
        throw new Error('useExchangeRate must be used within a ExchangeRatesProvider');
    }
    return context;
};

export default useExchangeRate;
