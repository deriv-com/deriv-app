import { useMemo } from 'react';
import { useLandingCompany } from '@deriv/api';

const useIsEuRegion = () => {
    const { data: landing_company, ...rest } = useLandingCompany();

    const isEuRegion = useMemo(() => {
        if (!landing_company) return false;

        const euShortcodeRegex = /^(maltainvest|malta|iom)$/;
        const euExcludedRegex = /^mt$/;

        const { gaming_company, financial_company, mt_gaming_company, mt_all_company, id: residence } = landing_company;
        const financialShortcode = financial_company?.shortcode;
        const gamingShortcode = gaming_company?.shortcode;
        const mtGamingShortcode = mt_gaming_company?.financial?.shortcode || mt_all_company?.swap_free?.shortcode;
        const isCurrentMf = financial_company?.shortcode === 'maltainvest';

        return (
            isCurrentMf ||
            (financialShortcode || gamingShortcode || mtGamingShortcode
                ? (euShortcodeRegex.test(financialShortcode as unknown as string) && gamingShortcode !== 'svg') ||
                  euShortcodeRegex.test(gamingShortcode as string)
                : euExcludedRegex.test(residence as string))
        );
    }, [landing_company]);

    return {
        data: isEuRegion,
        ...rest,
    };
};

export default useIsEuRegion;
