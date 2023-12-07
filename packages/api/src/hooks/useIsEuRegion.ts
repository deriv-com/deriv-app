import { useMemo } from 'react';
import useLandingCompany from './useLandingCompany';

const useIsEuRegion = () => {
    const { data: landing_company, ...rest } = useLandingCompany();

    const isEuRegion = useMemo(() => {
        if (!landing_company) return false;

        const eu_shortcode_regex = /^(maltainvest|malta|iom)$/;
        const eu_excluded_regex = /^mt$/;

        const { gaming_company, financial_company, mt_gaming_company, mt_all_company, id: residence } = landing_company;
        const financial_shortcode = financial_company?.shortcode;
        const gaming_shortcode = gaming_company?.shortcode;
        const mt_gaming_shortcode = mt_gaming_company?.financial?.shortcode || mt_all_company?.swap_free?.shortcode;

        const is_financial_maltainvest = financial_shortcode === 'maltainvest';
        const shortcodes = financial_shortcode || gaming_shortcode || mt_gaming_shortcode;
        const is_financial_eu_and_not_gaming_svg =
            eu_shortcode_regex.test(financial_shortcode as unknown as string) && gaming_shortcode !== 'svg';
        const is_gaming_eu = eu_shortcode_regex.test(gaming_shortcode as string);
        const is_residence_eu = eu_excluded_regex.test(residence as string);

        const is_eu_based_on_shortcodes = shortcodes && (is_financial_eu_and_not_gaming_svg || is_gaming_eu);
        const is_eu_based_on_residence = !shortcodes && is_residence_eu;

        return is_financial_maltainvest || is_eu_based_on_shortcodes || is_eu_based_on_residence;
    }, [landing_company]);

    return {
        data: isEuRegion,
        ...rest,
    };
};

export default useIsEuRegion;
