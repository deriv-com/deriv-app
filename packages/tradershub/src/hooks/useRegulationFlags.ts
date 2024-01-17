import { useActiveTradingAccount, useIsEuRegion, useTradingAccountsList } from '@deriv/api';
import { Regulation } from '../constants/constants';

/**
 * @description A custom hook that returns regulation flags based on the regulation passed in
 * @param regulation 'EU' | 'Non-EU'
 * @returns  { isDemo: boolean, isEU: boolean, isEUReal: boolean, isNonEU: boolean, isNonEUReal: boolean }
 */
const useRegulationFlags = (regulation?: string) => {
    const { isEUCountry } = useIsEuRegion();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { data: tradingAccountsList } = useTradingAccountsList();

    const isEURegulation = regulation === Regulation.EU;
    const isNonEURegulation = regulation === Regulation.NonEU;

    const isEU = isEUCountry || isEURegulation;
    const isNonEU = !isEUCountry || isNonEURegulation;
    const isDemo = activeTradingAccount?.is_virtual ?? false;

    const isEUReal = isEU && !isDemo;
    const isNonEUReal = isNonEU && !isDemo;

    const noRealCRNonEU = isNonEU && !tradingAccountsList?.find(account => account.broker === 'CR');
    const noRealMFEU = isEU && !tradingAccountsList?.find(account => account.broker === 'MF');

    return {
        isEU,
        isEUReal,
        isNonEU,
        isNonEUReal,
        noRealCRNonEU,
        noRealMFEU,
    };
};

export default useRegulationFlags;
