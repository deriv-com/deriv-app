import { useStore } from '@deriv/stores';
import type { DetailsOfEachMT5Loginid } from '@deriv/api-types';

const useTotalAccountBalance = (accounts: DetailsOfEachMT5Loginid[]) => {
    const { exchange_rates } = useStore();
    const currency = accounts?.[0].currency || 'USD';

    const balance = accounts.reduce((total, account) => {
        const base_rate = exchange_rates.data?.rates?.[currency] || 1;
        const rate = exchange_rates.data?.rates?.[account.currency || 'USD'] || 1;

        const exchange_rate = base_rate / rate;

        return total + (account.balance || 0) * exchange_rate;
    }, 0);

    return {
        balance,
        currency,
    };
};

export default useTotalAccountBalance;
