import { useMemo } from 'react';
import useLandingCompany from './useLandingCompany';

/** * A hook to determine if region is Eu using the useLandingCompany hook */
const useIsEuRegion = () => {
    const { data: landing_company, ...rest } = useLandingCompany();

    const isEU = useMemo(() => {
        if (!landing_company) return;

        const { gaming_company, financial_company } = landing_company;

        const isEuRegion = !gaming_company && financial_company?.shortcode === 'maltainvest';

        return isEuRegion;
    }, [landing_company]);

    return {
        /** A boolean flag indicating if the region is within the EU region */
        isEU,
        ...rest,
    };
};

export default useIsEuRegion;
