import { useMemo } from 'react';
import useLandingCompany from './useLandingCompany';

/**
 * A custom hook that provides flags to determine the accessibility status of cTrader and Dxtrade based on the current country of residence.
 */
const useAccesiblePlatforms = () => {
    const { data: landing_company, ...rest } = useLandingCompany();

    const modified_accesible_platform = useMemo(() => {
        if (!landing_company) return;

        /** check if ctrader jurisdiction is offered in the landing_company response  */
        const is_ctrader_available = landing_company?.ctrader?.all?.standard === 'svg';
        /** check if dxtrade is in the landing_company response */
        const is_dxtrade_available = landing_company?.dxtrade_all_company;
        /** check if MT5 is in the landing_company response */
        const is_mt5_available =
            landing_company?.mt_financial_company ||
            landing_company?.mt_gaming_company ||
            landing_company?.mt_all_company;

        return {
            /** is ctrader accessible for this country of residence */
            is_ctrader_available: !!is_ctrader_available,
            /** is dxtrade accessible for this country of residence */
            is_dxtrade_available: !!is_dxtrade_available,
            /** is mt5 accessible for this country of residence */
            is_mt5_available: !!is_mt5_available,
        };
    }, [landing_company]);

    return {
        data: modified_accesible_platform,
        ...rest,
    };
};

export default useAccesiblePlatforms;
