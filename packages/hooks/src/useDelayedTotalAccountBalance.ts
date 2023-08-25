import useRealTotalAssetCurrency from './useTotalAssetCurrency';
import useExchangeRate from './useExchangeRate';
import useThrottle from './useThrottle';

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
