import useLandingCompany from './useLandingCompany';

/**
 * A custom hook that returns a flag indicating whether ctrader and dxtrade are accessible for the current country of residence
 */
const useAccesiblePlatforms = () => {
    const { data: landing_company } = useLandingCompany();

    /** check if ctrader jurisdiction is offered in the landing_company response  */
    const is_ctrader_available = landing_company?.ctrader?.all?.standard === 'svg';
    /** check if dxtrade is in the landing_company response */
    const is_dxtrade_available = landing_company?.dxtrade_all_company;

    return {
        /** is ctrader accessible for this country of residence */
        isCtraderAvailable: !!is_ctrader_available,
        /** is dxtrade accessible for this country of residence */
        isDxtradeAvailable: !!is_dxtrade_available,
    };
};

export default useAccesiblePlatforms;
