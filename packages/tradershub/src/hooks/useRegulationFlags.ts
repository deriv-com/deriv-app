import { useMemo } from 'react';
import { Regulation } from '@/constants';
import { useUIContext } from '@/providers';
import { useActiveTradingAccount, useIsEuRegion, useLandingCompany, useTradingAccountsList } from '@deriv/api-v2';

/**
 * @description A custom hook that returns regulation flags based on the regulation passed in
 * @param regulation 'EU' | 'Non-EU'
 * @returns  { isDemo: boolean, isEU: boolean, isEUReal: boolean, isNonEU: boolean, isNonEUReal: boolean }
 */
const useRegulationFlags = () => {
    const { uiState } = useUIContext();
    const { accountType, regulation } = uiState;
    const { isEUCountry } = useIsEuRegion();
    const { data: activeTradingAccount, isSuccess: activeTradingAccountSuccess } = useActiveTradingAccount();
    const { data: tradingAccountsList, isSuccess: tradingAccountListSuccess } = useTradingAccountsList();
    const { data: landingCompany, isSuccess: landingCompanySuccess } = useLandingCompany();

    return useMemo(() => {
        const isHighRisk =
            landingCompany?.financial_company?.shortcode === 'svg' &&
            landingCompany?.gaming_company?.shortcode === 'svg';

        const isEURegulation = regulation === Regulation.EU;
        const isNonEURegulation = regulation === Regulation.NonEU;

        const isEU = isEUCountry || isEURegulation;
        const isNonEU = isHighRisk || isNonEURegulation;

        const isRealAccount = !activeTradingAccount?.is_virtual || accountType === 'real';

        const isEURealAccount = isEU && isRealAccount;
        const isNonEURealAccount = isNonEU && isRealAccount;

        const noRealCRNonEUAccount =
            isNonEU && !tradingAccountsList?.find(account => account.broker === 'CR') && isRealAccount;

        const noRealMFEUAccount =
            isEU && !tradingAccountsList?.find(account => account.broker === 'MF') && isRealAccount;

        const hasActiveDerivAccount = !(noRealCRNonEUAccount || noRealMFEUAccount);

        const isSuccess = activeTradingAccountSuccess && tradingAccountListSuccess && landingCompanySuccess;

        return {
            hasActiveDerivAccount,
            isEU,
            isEURealAccount,
            isHighRisk,
            isNonEU,
            isNonEURealAccount,
            isSuccess,
            noRealCRNonEUAccount,
            noRealMFEUAccount,
        };
    }, [
        landingCompany?.financial_company?.shortcode,
        landingCompany?.gaming_company?.shortcode,
        regulation,
        isEUCountry,
        activeTradingAccount?.is_virtual,
        accountType,
        tradingAccountsList,
        activeTradingAccountSuccess,
        tradingAccountListSuccess,
        landingCompanySuccess,
    ]);
};

export default useRegulationFlags;
