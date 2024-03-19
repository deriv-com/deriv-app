import { LandingCompanyDetails, MT5MarketTypeDetails, PlatformDetails } from '../constants';
import { THooks, TMarketTypes } from '../hooks/types';

type TGetAccountNameProps = {
    accountCategory: THooks.TransferAccounts[number]['account_category'];
    accountType: THooks.TransferAccounts[number]['account_type'];
    mt5MarketType?: TMarketTypes.SortedMT5Accounts;
};

export const getAccountName = ({ accountCategory, accountType, mt5MarketType }: TGetAccountNameProps) => {
    if (accountCategory === 'trading') {
        switch (accountType) {
            case PlatformDetails.binary.name:
            case PlatformDetails.standard.name:
                return PlatformDetails.standard.title;
            case PlatformDetails.dxtrade.name:
                return PlatformDetails.dxtrade.title;
            case PlatformDetails.ctrader.name:
                return PlatformDetails.ctrader.title;
            case PlatformDetails.mt5.name: {
                // eslint-disable-next-line sonarjs/no-nested-switch
                switch (mt5MarketType) {
                    case MT5MarketTypeDetails.financial.name:
                        return MT5MarketTypeDetails.financial.landingCompany?.svg.title;
                    case MT5MarketTypeDetails.synthetic.name:
                        return MT5MarketTypeDetails.synthetic.title;
                    case MT5MarketTypeDetails.all.name:
                        return MT5MarketTypeDetails.all.title;
                    default:
                        return '';
                }
            }
            default:
                return '';
        }
    }

    return '';
};

//TODO: remove this function when landing_company_name will be added to transfer_between_accounts response in API for mt5 accounts
export const getLandingCompanyNameOfMT5Account = (mt5Group?: string) => {
    if (mt5Group?.includes(LandingCompanyDetails.bvi.name)) return LandingCompanyDetails.bvi.name;
    if (mt5Group?.includes(LandingCompanyDetails.labuan.name)) return LandingCompanyDetails.labuan.name;
    if (mt5Group?.includes(LandingCompanyDetails.svg.name)) return LandingCompanyDetails.svg.name;
    if (mt5Group?.includes(LandingCompanyDetails.vanuatu.name)) return LandingCompanyDetails.vanuatu.name;
    return LandingCompanyDetails.svg.name;
};

export const getMarketType = (mt5Group?: string) => {
    if (mt5Group?.includes(MT5MarketTypeDetails.financial.name)) return MT5MarketTypeDetails.financial.name;
    if (mt5Group?.includes(MT5MarketTypeDetails.synthetic.name)) return MT5MarketTypeDetails.synthetic.name;
    if (mt5Group?.includes(MT5MarketTypeDetails.all.name)) return MT5MarketTypeDetails.all.name;
    return MT5MarketTypeDetails.all.name;
};
