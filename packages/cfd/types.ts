import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

export type TNewDetailsOfEachMT5Loginid = Required<
    Omit<DetailsOfEachMT5Loginid, 'market_type'> & { market_type?: 'financial' | 'synthetic' | 'all' }
>;

export type TTradingPlatformAvailableAccount = {
    market_type: 'financial' | 'gaming' | 'all';
    name: string;
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
    shortcode: 'bvi' | 'labuan' | 'svg' | 'vanuatu';
    sub_account_type: string;
};
