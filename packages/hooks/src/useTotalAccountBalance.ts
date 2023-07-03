import useRealTotalAssetCurrency from './useTotalAssetCurrency';
import useExchangeRate from './useExchangeRate';
import { useEffect, useState } from 'react';
/**
 * we can use this hook to get the total balance of the given accounts list.
 * it loops through the accounts list and adds the balance of each account
 * to the total balance, it also converts the balance to the currency of the
 * first account in the list
 */
const useTotalAccountBalance = (accounts: { balance?: number; currency?: string }[]) => {
    const total_assets_real_currency = useRealTotalAssetCurrency();
    const { getRate } = useExchangeRate();

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (!accounts.length) {
            setBalance(0);
            return;
        }

        const updatedBalance = accounts.reduce((total, account) => {
            const base_rate = getRate(total_assets_real_currency || '');
            const rate = getRate(account.currency || total_assets_real_currency || '');
            const exchange_rate = base_rate / rate;
            return total + (account.balance || 0) * exchange_rate;
        }, 0);

        setBalance(updatedBalance);
    }, [accounts, getRate, total_assets_real_currency]);

    return {
        balance,
        currency: total_assets_real_currency,
    };
};

export default useTotalAccountBalance;
