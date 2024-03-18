import { LandingCompanyDetails, MT5MarketTypeDetails } from '../constants';

//TODO: remove this function when landing_company_name will be added to transfer_between_accounts response in API for mt5 accounts
export const getLandingCompanyTitleOfMT5Account = (mt5Group?: string) => {
    if (mt5Group?.includes(LandingCompanyDetails.bvi.name)) return LandingCompanyDetails.bvi.title;
    if (mt5Group?.includes(LandingCompanyDetails.labuan.name)) return LandingCompanyDetails.labuan.title;
    if (mt5Group?.includes(LandingCompanyDetails.svg.name)) return LandingCompanyDetails.svg.title;
    if (mt5Group?.includes(LandingCompanyDetails.vanuatu.name)) return LandingCompanyDetails.vanuatu.title;
    return LandingCompanyDetails.svg.title;
};

export const getMarketType = (mt5Group?: string) => {
    if (mt5Group?.includes(MT5MarketTypeDetails.financial.name)) return MT5MarketTypeDetails.financial.title;
    if (mt5Group?.includes(MT5MarketTypeDetails.synthetic.name)) return MT5MarketTypeDetails.synthetic.title;
    if (mt5Group?.includes(MT5MarketTypeDetails.all.name)) return MT5MarketTypeDetails.all.title;
    return MT5MarketTypeDetails.all.name;
};
