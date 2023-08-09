import React from 'react';
import type { LandingCompany } from '@deriv/api-types';

/** A custom hook to get the list of active symbols. */
const useStandPoint = (new_lc: LandingCompany) => {
    const { gaming_company, financial_company } = new_lc;
    // All possible landing companies of user between all
    let standpoint = {
        iom: false,
        svg: false,
        malta: false,
        maltainvest: false,
        gaming_company: '',
        financial_company: '',
    };

    if (gaming_company?.shortcode) {
        standpoint = {
            ...standpoint,
            [gaming_company.shortcode]: !!gaming_company?.shortcode,
            gaming_company: gaming_company?.shortcode ?? false,
        };
    }
    if (financial_company?.shortcode) {
        standpoint = {
            ...standpoint,
            [financial_company.shortcode]: !!financial_company?.shortcode,
            financial_company: financial_company?.shortcode ?? false,
        };
    }

    return {
        standpoint,
        is_mx_mlt: standpoint.iom || standpoint.malta,
    };
};

export default useStandPoint;
