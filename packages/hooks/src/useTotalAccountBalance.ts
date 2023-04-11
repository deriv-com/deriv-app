import { useStore } from '@deriv/stores';

/**
 * we can use this hook to get the total balance of the given accounts list.
 * it loops through the accounts list and adds the balance of each account
 * to the total balance, it also converts the balance to the currency of the
 * first account in the list
 * @example:
 * const accounts_total_balance = useTotalAccountBalance([
 *      { balance: 100, currency: 'USD' },
 *      { balance: 50, currency: 'USD' },
 *  ]);
 * @returns \{ balance: 150, currency: 'USD' }
 */

const useTotalAccountBalance = (accounts: { balance?: number; currency?: string }[]) => {
    const { exchange_rates } = useStore();
    const currency = accounts?.[0]?.currency || 'USD';

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
