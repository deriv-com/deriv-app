import useActiveTradingAccount from './useActiveTradingAccount';
import useCFDAccountsList from './useCFDAccountsList';
import useTradingAccountsList from './useTradingAccountsList';
import { displayMoney } from '../utils';
import useAuthorize from './useAuthorize';
import useExchangeRates from './useExchangeRates';
import { useEffect } from 'react';

/**
 * @description Get total balance of all accounts
 * @returns data - Total balance of all accounts
 */
const useTotalAssets = () => {
    const { data: tradingAccount, isSuccess: isTradingAccountSuccess, fiat_account } = useTradingAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { data: cfdAccount, isSuccess: isCFDAccountSuccess } = useCFDAccountsList();
    const { data: authorize_data, isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data, subscribe: multiSubscribe, unsubscribe, getExchangeRate } = useExchangeRates();

    const demoAccount = tradingAccount?.find(account => account.is_virtual);
    const realAccounts = tradingAccount?.filter(account => !account.is_virtual);

    useEffect(() => {
        if (isTradingAccountSuccess && fiat_account !== undefined) {
            multiSubscribe({
                base_currency: fiat_account,
                target_currencies: realAccounts?.map(account => account.currency ?? 'USD') ?? [],
            });
        }
    }, [data, fiat_account, isTradingAccountSuccess, multiSubscribe, realAccounts, unsubscribe]);

    const totalRealPlatformBalance =
        realAccounts?.reduce((total, account) => {
            const exchangeRate = getExchangeRate(fiat_account ?? 'USD', account.currency ?? 'USD');
            return total + (account.balance ?? 0) / exchangeRate;
        }, 0) ?? 0;

    const demoAccountBalance = demoAccount?.balance ?? 0;

    const demoMT5AccountBalance = cfdAccount?.mt5.find(account => account.is_virtual)?.converted_balance ?? 0;

    const realMT5AccountBalance =
        cfdAccount?.mt5
            .filter(account => !account.is_virtual)
            .reduce((total, account) => total + account.converted_balance, 0) ?? 0;

    const demoDxtradeAccountBalance = cfdAccount?.dxtrade.find(account => account.is_virtual)?.converted_balance ?? 0;

    const realDxtradeAccountBalance = cfdAccount?.dxtrade.find(account => !account.is_virtual)?.converted_balance ?? 0;

    const ctraderDemoAccountBalance = cfdAccount?.ctrader.find(account => account.is_virtual)?.converted_balance ?? 0;

    const ctraderRealAccountBalance = cfdAccount?.ctrader.find(account => !account.is_virtual)?.converted_balance ?? 0;

    const totalRealCFDBalance = realMT5AccountBalance + realDxtradeAccountBalance + ctraderRealAccountBalance;

    const totalDemoCFDBalance = demoMT5AccountBalance + demoDxtradeAccountBalance + ctraderDemoAccountBalance;

    const demoTotalBalance = demoAccountBalance + totalDemoCFDBalance;

    const realTotalBalance = totalRealPlatformBalance + totalRealCFDBalance;

    const totalBalance = activeTradingAccount?.is_virtual ? demoTotalBalance : realTotalBalance;

    const formattedTotalBalance = displayMoney(totalBalance, fiat_account ?? 'USD', {
        fractional_digits: 2,
        preferred_language: authorize_data?.preferred_language,
    });

    return {
        //Returns the total balance of all accounts
        data: formattedTotalBalance,
        //Returns true if all the requests are successful
        isSuccess: isTradingAccountSuccess && isCFDAccountSuccess && isAuthorizeSuccess,
        realAccounts,
    };
};

export default useTotalAssets;
