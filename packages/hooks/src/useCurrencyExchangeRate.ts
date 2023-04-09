import { useStore } from '@deriv/stores';

const useCurrencyExchangeRate = (currency: string) => {
    const { exchange_rates } = useStore();
    const rate = exchange_rates.data?.rates?.[currency || 'USD'] || 1;

    return rate;
};

export default useCurrencyExchangeRate;
