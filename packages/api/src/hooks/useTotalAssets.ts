import useActiveTradingAccount from './useActiveTradingAccount';
import useCFDAccountsList from './useCFDAccountsList';
import useTradingAccountsList from './useTradingAccountsList';
import { displayMoney } from '../utils';
import useAuthorize from './useAuthorize';

/**
 * @description Get total balance of all accounts
 * @returns data - Total balance of all accounts
 */
const useTotalAssets = () => {
    const { data: tradingAccount, isSuccess: isTradingAccountSuccess } = useTradingAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { data: cfdAccount, isSuccess: isCFDAccountSuccess } = useCFDAccountsList();
    const { data: authorize_data, isSuccess: isAuthorizeSuccess } = useAuthorize();

    const mt5AccountsBalance = cfdAccount?.mt5.map(account => account.balance ?? 0).reduce((a, b) => a + b, 0) ?? 0;
    const dxtradeAccountsBalance =
        cfdAccount?.dxtrade.map(account => account.balance ?? 0).reduce((a, b) => a + b, 0) ?? 0;
    const ctraderAccountsBalance =
        cfdAccount?.ctrader.map(account => account.balance ?? 0).reduce((a, b) => a + b, 0) ?? 0;

    const demoAccount = tradingAccount?.find(account => account.is_virtual);
    const realAccounts = tradingAccount?.filter(account => !account.is_virtual);

    const realAccountsBalance = realAccounts?.map(account => account.balance ?? 0).reduce((a, b) => a + b, 0) ?? 0;

    const demoAccountBalance = demoAccount?.balance ?? 0;

    const totalCFDBalance = mt5AccountsBalance + dxtradeAccountsBalance + ctraderAccountsBalance;

    const demoTotalBalance = demoAccountBalance + totalCFDBalance;

    const realTotalBalance = realAccountsBalance + totalCFDBalance;

    const totalBalance = activeTradingAccount?.is_virtual ? demoTotalBalance : realTotalBalance;

    const formattedTotalBalance = displayMoney(totalBalance, 'USD', {
        fractional_digits: 2,
        preferred_language: authorize_data?.preferred_language,
    });

    return {
        //Returns the total balance of all accounts
        data: formattedTotalBalance,
        //Returns true if all the requests are successful
        isSuccess: isTradingAccountSuccess && isCFDAccountSuccess && isAuthorizeSuccess,
    };
};

export default useTotalAssets;
