import { useStore } from '@deriv/stores';

const useCurrencyExcahngeRate = (currency: string) => {
    const { exchange_rates } = useStore();
    const rate = exchange_rates?.data?.rates?.[currency] || 1;

    return rate;
};

export default useCurrencyExcahngeRate;
