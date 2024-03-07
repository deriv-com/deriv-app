import { useCFDAccountsList } from '@deriv/api-v2';

/**
 * @description This hook is used to get the total demo and real CFD balance
 * @example
 * const { totalRealCFDBalance, totalDemoCFDBalance, isSuccess } = useCFDAssets(regulation);
 */
const useCFDAssets = (regulation?: string) => {
    const { data: cfdAccount, isSuccess: isCFDAccountSuccess } = useCFDAccountsList();

    const demoMT5AccountBalance = cfdAccount?.mt5.find(account => account.is_virtual)?.converted_balance ?? 0;

    const isEURegulation = regulation === 'EU';

    const realMT5AccountBalance =
        cfdAccount?.mt5
            .filter(account => {
                if (isEURegulation) {
                    return !account.is_virtual && account.landing_company_short === 'maltainvest';
                }
                return !account.is_virtual && account.landing_company_short !== 'maltainvest';
            })
            .reduce((total, account) => total + account.converted_balance, 0) ?? 0;

    // Calculate Dxtrade account balances
    const demoDxtradeAccountBalance = cfdAccount?.dxtrade.find(account => account.is_virtual)?.converted_balance ?? 0;
    const realDxtradeAccountBalance = cfdAccount?.dxtrade.find(account => !account.is_virtual)?.converted_balance ?? 0;

    // Calculate Ctrader account balances
    const ctraderDemoAccountBalance = cfdAccount?.ctrader.find(account => account.is_virtual)?.converted_balance ?? 0;
    const ctraderRealAccountBalance = cfdAccount?.ctrader.find(account => !account.is_virtual)?.converted_balance ?? 0;

    // Calculate total real and demo CFD balances
    const totalRealCFDBalance = realMT5AccountBalance + realDxtradeAccountBalance + ctraderRealAccountBalance;
    const totalDemoCFDBalance = demoMT5AccountBalance + demoDxtradeAccountBalance + ctraderDemoAccountBalance;

    // Calculate final real and demo balances based on regulation
    const calculatedRealBalance = isEURegulation ? realMT5AccountBalance : totalRealCFDBalance;
    const calculatedDemoBalance = isEURegulation ? demoMT5AccountBalance : totalDemoCFDBalance;

    return {
        calculatedDemoBalance,
        calculatedRealBalance,
        isSuccess: isCFDAccountSuccess,
    };
};

export default useCFDAssets;
