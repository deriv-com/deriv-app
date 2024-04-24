import { useStore } from '@deriv/stores';

export const useExchangeRate = () => {
    const { client } = useStore();
    const {
        exchange_rates,
        subscribeToExchangeRate,
        getExchangeRate,
        unsubscribeFromExchangeRate,
        unsubscribeFromAllExchangeRates,
    } = client;

    return {
        handleSubscription: subscribeToExchangeRate,
        exchange_rates,
        getExchangeRate,
        unsubscribe: unsubscribeFromExchangeRate,
        unsubscribeAll: unsubscribeFromAllExchangeRates,
    };
};

export default useExchangeRate;
