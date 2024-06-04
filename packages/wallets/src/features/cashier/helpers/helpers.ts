import { THooks, TMarketTypes, TWalletLandingCompanyName } from '../../../types';
import { LandingCompanyDetails, MT5MarketTypeDetails, PlatformDetails } from '../constants';

type TGetAccountNameProps = {
    accountCategory: THooks.TransferAccount['account_category'];
    accountType: THooks.TransferAccount['account_type'];
    displayCurrencyCode?: THooks.CurrencyConfig['display_code'];
    landingCompanyName: TWalletLandingCompanyName;
    mt5MarketType?: TMarketTypes.SortedMT5Accounts;
};

//TODO: remove this function when market_type will be added to transfer_between_accounts response in API
export const getMarketType = (mt5Group?: string) => {
    if (mt5Group?.includes(MT5MarketTypeDetails.financial.name)) return MT5MarketTypeDetails.financial.name;
    if (mt5Group?.includes(MT5MarketTypeDetails.synthetic.name)) return MT5MarketTypeDetails.synthetic.name;
    if (mt5Group?.includes(MT5MarketTypeDetails.all.name)) return MT5MarketTypeDetails.all.name;
    return undefined;
};

//TODO: remove this function when landing_company_name will be added to transfer_between_accounts response in API for mt5 accounts
export const getLandingCompanyNameOfMT5Account = (mt5Group?: string) => {
    if (mt5Group?.includes(LandingCompanyDetails.bvi.name)) return LandingCompanyDetails.bvi.name;
    if (mt5Group?.includes(LandingCompanyDetails.labuan.name)) return LandingCompanyDetails.labuan.name;
    if (mt5Group?.includes(LandingCompanyDetails.svg.name)) return LandingCompanyDetails.svg.name;
    if (mt5Group?.includes(LandingCompanyDetails.vanuatu.name)) return LandingCompanyDetails.vanuatu.name;
    return LandingCompanyDetails.svg.name;
};

export const getTradingAppIcon = (
    accountType: string,
    landingCompanyName: TWalletLandingCompanyName,
    mt5Group?: string
) => {
    const marketType = getMarketType(mt5Group);
    const mt5Platform = PlatformDetails.mt5;

    if (accountType === mt5Platform.name) {
        if (marketType === mt5Platform.marketType.financial.name) {
            return mt5Platform.marketType.financial.landingCompany?.[landingCompanyName].icon.light;
        } else if (marketType === mt5Platform.marketType.synthetic.name) {
            return mt5Platform.marketType.synthetic.icon?.light;
        }
        return mt5Platform.marketType.all.icon?.light;
    }
    //@ts-expect-error needs backend typing
    return PlatformDetails[accountType]?.icon.light;
};

export const getAccountName = ({
    accountCategory,
    accountType,
    displayCurrencyCode,
    landingCompanyName,
    mt5MarketType,
}: TGetAccountNameProps) => {
    switch (accountCategory) {
        case 'wallet':
            return `${displayCurrencyCode} Wallet`;
        case 'trading': {
            switch (accountType) {
                case PlatformDetails.binary.name:
                case PlatformDetails.standard.name:
                    return PlatformDetails.standard.title;
                case PlatformDetails.dxtrade.name:
                    return PlatformDetails.dxtrade.title;
                case PlatformDetails.ctrader.name:
                    return PlatformDetails.ctrader.title;
                case PlatformDetails.mt5.name: {
                    switch (mt5MarketType) {
                        case MT5MarketTypeDetails.financial.name:
                            return [
                                MT5MarketTypeDetails.financial.landingCompany?.svg.name,
                                MT5MarketTypeDetails.financial.landingCompany?.virtual.name,
                            ].includes(
                                landingCompanyName as Extract<
                                    TGetAccountNameProps['landingCompanyName'],
                                    'svg' | 'virtual'
                                >
                            )
                                ? MT5MarketTypeDetails.financial.landingCompany?.svg.title
                                : MT5MarketTypeDetails.financial.landingCompany?.malta.title;
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
        default:
            return '';
    }
};
