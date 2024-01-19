import { useMemo } from 'react';
import { useActiveTradingAccount, useIsEuRegion, useLandingCompany, useTradingAccountsList } from '@deriv/api';
import { Regulation } from '../constants/constants';

/**
 * @description A custom hook that returns regulation flags based on the regulation passed in
 * @param regulation 'EU' | 'Non-EU'
 * @returns  { isDemo: boolean, isEU: boolean, isEUReal: boolean, isNonEU: boolean, isNonEUReal: boolean }
 */
const useRegulationFlags = (regulation?: string, accountType?: string) => {
    const { isEUCountry } = useIsEuRegion();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { data: tradingAccountsList } = useTradingAccountsList();
    const { data: landingCompany } = useLandingCompany();

    return useMemo(() => {
        const isHighRisk =
            landingCompany?.financial_company?.shortcode === 'svg' &&
            landingCompany?.gaming_company?.shortcode === 'svg';

        const isEURegulation = regulation === Regulation.EU;
        const isNonEURegulation = regulation === Regulation.NonEU;

        const isEU = isEUCountry || isEURegulation;
        const isNonEU = !isEUCountry || isNonEURegulation;

        const isRealAccount = !activeTradingAccount?.is_virtual || accountType === 'real';

        const isEURealAccount = isEU && isRealAccount;
        const isNonEURealAccount = isNonEU && isRealAccount;

        const noRealCRNonEUAccount =
            isNonEU && !tradingAccountsList?.find(account => account.broker === 'CR') && isRealAccount;

        const noRealMFEUAccount =
            isEU && !tradingAccountsList?.find(account => account.broker === 'MF') && isRealAccount;

        const hasActiveDerivAccount = !(noRealCRNonEUAccount || noRealMFEUAccount);

        return {
            hasActiveDerivAccount,
            isEU,
            isEURealAccount,
            isHighRisk,
            isNonEU,
            isNonEURealAccount,
            noRealCRNonEUAccount,
            noRealMFEUAccount,
        };
    }, [isEUCountry, activeTradingAccount, tradingAccountsList, landingCompany, regulation, accountType]);
};

export default useRegulationFlags;
