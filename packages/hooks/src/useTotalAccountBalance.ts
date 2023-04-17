import { useStore } from '@deriv/stores';

/**
 * we can use this hook to get the total balance of the given accounts list.
 * it loops through the accounts list and adds the balance of each account
 * to the total balance, it also converts the balance to the currency of the
 * first account in the list
 */

const useTotalAccountBalance = (accounts: { balance?: number; currency?: string }[]) => {
    const { client, exchange_rates, traders_hub } = useStore();

    if (!accounts.length) return { balance: 0, currency: 'USD' };

    const { current_fiat_currency, is_crypto, currency, default_currency } = client;
    const { is_eu_user } = traders_hub;

    const currency_if_is_crypto = is_eu_user ? current_fiat_currency || default_currency : default_currency;

    const total_assets_real_currency = is_crypto ? currency_if_is_crypto : currency;

    const balance = accounts.reduce((total, account) => {
        const base_rate = exchange_rates.data?.rates?.[total_assets_real_currency] || 1;
        const rate = exchange_rates.data?.rates?.[account.currency || default_currency] || 1;
        const exchange_rate = base_rate / rate;

        return total + (account.balance || 0) * exchange_rate;
    }, 0);

    return {
        balance,
        currency: total_assets_real_currency,
    };
};

export default useTotalAccountBalance;
