import { useMemo } from 'react';
import useLandingCompany from './useLandingCompany';

/** * A hook to determine if region is Eu using the useLandingCompany hook */
const useIsEuRegion = () => {
    /** Retrieve landing company data*/
    const { data: landing_company, ...rest } = useLandingCompany();

    const isEuRegion = useMemo(() => {
        if (!landing_company) return false;

        /** Regular expressions for EU shortcodes and excluded residence */
        const eu_shortcode_regex = /^maltainvest$/;
        const eu_excluded_regex = /^mt$/;

        /** Destructure landing company response */
        const { gaming_company, financial_company, mt_gaming_company, mt_all_company, id: residence } = landing_company;
        const financial_shortcode = financial_company?.shortcode;
        const gaming_shortcode = gaming_company?.shortcode;
        const mt_gaming_shortcode = mt_gaming_company?.financial?.shortcode || mt_all_company?.swap_free?.shortcode;

        /** Determine if the region falls in the EU using destructured data */
        const is_financial_maltainvest = financial_shortcode === 'maltainvest';
        const shortcodes = financial_shortcode || gaming_shortcode || mt_gaming_shortcode;
        const is_financial_eu_and_not_gaming_svg =
            eu_shortcode_regex.test(financial_shortcode as unknown as string) && gaming_shortcode !== 'svg';
        const is_gaming_eu = eu_shortcode_regex.test(gaming_shortcode as string);
        const is_residence_eu = eu_excluded_regex.test(residence as string);

        /** is region Eu based on shortcode */
        const is_eu_based_on_shortcodes = shortcodes && (is_financial_eu_and_not_gaming_svg || is_gaming_eu);
        /** is region Eu based on residence */
        const is_eu_based_on_residence = !shortcodes && is_residence_eu;

        return is_financial_maltainvest || is_eu_based_on_shortcodes || is_eu_based_on_residence;
    }, [landing_company]);

    // New method to test, if this works will remove the legacy method above
    const isEUCountry = useMemo(() => {
        if (!landing_company) return;

        const { gaming_company, financial_company } = landing_company;
        const isEuRegion = !gaming_company && financial_company?.shortcode === 'maltainvest';

        return isEuRegion;
    }, [landing_company]);

    return {
        /** A boolean flag indicating if the region is within the EU */
        data: isEuRegion,
        isEUCountry,
        /** Additional properties inherited from the useLandingCompany hook */
        ...rest,
    };
};

export default useIsEuRegion;
