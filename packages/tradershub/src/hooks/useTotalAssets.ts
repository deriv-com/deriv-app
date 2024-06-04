import { displayMoney } from '@/helpers';
import { useUIContext } from '@/providers';
import { useActiveTradingAccount, useAuthorize } from '@deriv/api-v2';
import useCFDAssets from './useCFDAssets';
import usePlatformAssets from './usePlatformAssets';

/**
 * @description Get total balance of cfd and platform accounts
 * @returns data - Total balance of all cfd and platform accounts
 */
const useTotalAssets = () => {
    const { uiState } = useUIContext();
    const { regulation } = uiState;
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { data: authorizeData, isSuccess: isAuthorizeSuccess } = useAuthorize();
    const {
        demoAccountBalance,
        fiatCurrency,
        isSuccess: isPlatformSuccess,
        realAccounts,
        totalRealPlatformBalance,
    } = usePlatformAssets(regulation);
    const { calculatedDemoBalance, calculatedRealBalance, isSuccess: isCFDSuccess } = useCFDAssets(regulation);

    const demoTotalBalance = demoAccountBalance + calculatedDemoBalance;

    const realTotalBalance = totalRealPlatformBalance + calculatedRealBalance;

    const totalBalance = activeTradingAccount?.is_virtual ? demoTotalBalance : realTotalBalance;

    const formattedTotalBalance = displayMoney(totalBalance, fiatCurrency ?? 'USD', {
        fractional_digits: 2,
        preferred_language: authorizeData?.preferred_language,
    });

    return {
        //Returns the total balance of all accounts
        data: formattedTotalBalance,
        //Returns true if all the requests are successful
        isSuccess: isPlatformSuccess && isCFDSuccess && isAuthorizeSuccess,
        realAccounts,
    };
};

export default useTotalAssets;
