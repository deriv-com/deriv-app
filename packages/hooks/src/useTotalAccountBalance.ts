import useRealTotalAssetCurrency from './useTotalAssetCurrency';
import useExchangeRate from './useExchangeRate';
import { useStore } from '@deriv/stores';
import { useCallback } from 'react';
import useThrottle from './useThrottle';
/**
 * we can use this hook to get the total balance of the given accounts list.
 * it loops through the accounts list and adds the balance of each account
 * to the total balance, it also converts the balance to the currency of the
 * first account in the list
 */
type TUseTotalAccountBalance = {
    balance?: number;
    currency?: string;
    account_type?: string;
};

const useThrottledExchangeRate = (currency: string) => {
    const { exchange_rates } = useStore();
    const data = exchange_rates.data;
    const rates = data?.rates;
    const value = rates?.[currency] || 1;

    const throttledValue = useThrottle(value, 20 * 1000);

    return throttledValue;
};

const useTotalAccountBalance = (accounts: TUseTotalAccountBalance[]) => {
    const total_assets_real_currency = useRealTotalAssetCurrency();
    const { getRate } = useExchangeRate();
    // const throttled_rates = useThrottledExchangeRate(total_assets_real_currency || '');

    if (!accounts.length) return { balance: 0, currency: total_assets_real_currency };

    const balance = accounts.reduce((total, account) => {
        const base_rate = account?.account_type === 'demo' ? 1 : getRate(total_assets_real_currency || '');
        const rate = getRate(account.currency || total_assets_real_currency || '');
        const exchange_rate = base_rate / rate;

        return total + (account.balance || 0) * exchange_rate;
    }, 0);

    return {
        balance,
        currency: total_assets_real_currency,
    };
};

export default useTotalAccountBalance;
