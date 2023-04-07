import { useStore } from '@deriv/stores';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

const useTotalAccountBalance = (accounts: DetailsOfEachMT5Loginid[]) => {
    const { client, exchange_rates } = useStore();
    const { default_currency } = client;

    const total_balance = accounts.reduce((total, account) => {
        const base_rate = exchange_rates?.data?.rates?.[default_currency] || 1;
        const rate = exchange_rates?.data?.rates?.[account.currency!] || 1;

        const exchange_rate = base_rate / rate;

        total += (account.balance || 0) * exchange_rate; // eslint-disable-line no-param-reassign
        return total;
    }, 0);

    return total_balance;
};

export default useTotalAccountBalance;
