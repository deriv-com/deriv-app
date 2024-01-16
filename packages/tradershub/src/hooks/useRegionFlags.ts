import { useActiveTradingAccount, useIsEuRegion, useTradingAccountsList } from '@deriv/api';
import { Region } from '../constants/constants';

/**
 * @description A custom hook that returns region flags based on the region passed in
 * @param region 'EU' | 'Non-EU'
 * @returns  { isDemo: boolean, isEU: boolean, isEUReal: boolean, isNonEU: boolean, isNonEUReal: boolean }
 */
const useRegionFlags = (region?: string) => {
    const { isEUCountry } = useIsEuRegion();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { data: tradingAccountsList } = useTradingAccountsList();

    const isEURegion = region === Region.EU;
    const isNonEURegion = region === Region.NonEU;

    const isEU = isEUCountry || isEURegion;
    const isNonEU = !isEUCountry || isNonEURegion;
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

export default useRegionFlags;
