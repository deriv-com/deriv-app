import { Jurisdiction } from '@deriv/shared';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { CFD_PLATFORMS, CATEGORY, MARKET_TYPE, MOBILE_PLATFORMS } from 'Helpers/cfd-config';

export type TMobilePlatforms = keyof typeof MOBILE_PLATFORMS;

export type TCFDPlatform = keyof typeof CFD_PLATFORMS;

export type TTokens = {
    demo: string;
    real: string;
};

export type TJurisdiction = typeof Jurisdiction[keyof typeof Jurisdiction];

export type TTradingPlatformAvailableAccount = {
    name: string;
    sub_account_type: string;
    account_type?: keyof typeof CATEGORY;
    market_type: keyof typeof MARKET_TYPE;
    requirements: {
        after_first_deposit: {
            financial_assessment: string[];
        };
        compliance: {
            mt5: string[];
            tax_information: string[];
        };
        signup: string[];
    };
    shortcode: DetailsOfEachMT5Loginid['landing_company_short'];
    landing_company_short?: DetailsOfEachMT5Loginid['landing_company_short'];
};
