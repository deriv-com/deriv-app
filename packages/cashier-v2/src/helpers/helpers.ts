import { LandingCompanyDetails, MT5MarketTypeDetails } from '../constants';

export const getMT5AccountDetails = (mt5Group?: string) => {
    const landingCompany = () => {
        if (mt5Group?.includes(LandingCompanyDetails.bvi.name)) return LandingCompanyDetails.bvi;
        if (mt5Group?.includes(LandingCompanyDetails.labuan.name)) return LandingCompanyDetails.labuan;
        if (mt5Group?.includes(LandingCompanyDetails.maltainvest.name)) return LandingCompanyDetails.labuan;
        if (mt5Group?.includes(LandingCompanyDetails.svg.name)) return LandingCompanyDetails.svg;
        if (mt5Group?.includes(LandingCompanyDetails.vanuatu.name)) return LandingCompanyDetails.vanuatu;
        return LandingCompanyDetails.svg;
    };

    const marketType = () => {
        if (mt5Group?.includes(MT5MarketTypeDetails.financial.name)) return MT5MarketTypeDetails.financial;
        if (mt5Group?.includes(MT5MarketTypeDetails.synthetic.name)) return MT5MarketTypeDetails.synthetic;
        if (mt5Group?.includes(MT5MarketTypeDetails.all.name)) return MT5MarketTypeDetails.all;
        return MT5MarketTypeDetails.all;
    };

    return {
        landingCompanyDetails: landingCompany(),
        marketTypeDetails: marketType(),
    };
};
