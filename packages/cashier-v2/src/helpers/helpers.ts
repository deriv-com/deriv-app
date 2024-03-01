import { MT5MarketTypeDetails, PlatformDetails } from '../constants';
import { THooks, TMarketTypes, TWalletLandingCompanyName } from '../hooks/types';

type TGetAccountNameProps = {
    accountCategory: THooks.TransferAccount['account_category'];
    accountType: THooks.TransferAccount['account_type'];
    displayCurrencyCode?: THooks.CurrencyConfig['display_code'];
    landingCompanyName: TWalletLandingCompanyName;
    mt5MarketType?: TMarketTypes.SortedMT5Accounts;
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
            // eslint-disable-next-line sonarjs/no-nested-switch
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

export const getMarketType = (mt5Group?: string) => {
    if (mt5Group?.includes(MT5MarketTypeDetails.financial.name)) return MT5MarketTypeDetails.financial.name;
    if (mt5Group?.includes(MT5MarketTypeDetails.synthetic.name)) return MT5MarketTypeDetails.synthetic.name;
    if (mt5Group?.includes(MT5MarketTypeDetails.all.name)) return MT5MarketTypeDetails.all.name;
    return MT5MarketTypeDetails.all.name;
};
