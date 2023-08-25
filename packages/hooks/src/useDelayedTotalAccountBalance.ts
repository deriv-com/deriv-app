import useRealTotalAssetCurrency from './useTotalAssetCurrency';
import useExchangeRate from './useExchangeRate';
import useThrottle from './useThrottle';

/**
 * we can use this hook to get the total balance of the given accounts list with a delay given to the hook as the second parameter. notice that the delay should be in milliseconds.
 * it loops through the accounts list and adds the balance of each account
 * to the total balance, it also converts the balance to the currency of the
 * first account in the list and then throttles the balance with the given delay and returns the throttled balance
 */

type TUseDelayedTotalAccountBalance = {
    balance?: number;
    currency?: string;
    account_type?: string;
};

const useDelayedTotalAccountBalance = (accounts: TUseDelayedTotalAccountBalance[], delay: number) => {
    const total_assets_real_currency = useRealTotalAssetCurrency();
    const { getRate } = useExchangeRate();

    const balance = accounts.reduce((total, account) => {
        const base_rate = account?.account_type === 'demo' ? 1 : getRate(total_assets_real_currency || '');
        const rate = getRate(account.currency || total_assets_real_currency || '');
        const exchange_rate = base_rate / rate;

        return total + (account.balance || 0) * exchange_rate;
    }, 0);

    const delayedBalance = useThrottle(balance, delay);

    return {
        balance: delayedBalance || 0,
        currency: total_assets_real_currency,
    };
};

export default useDelayedTotalAccountBalance;
