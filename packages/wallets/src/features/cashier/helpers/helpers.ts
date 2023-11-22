import { THooks, TMarketTypes, TWalletLandingCompanyName } from '../../../types';
import { appIconMapper, walletIconMapper } from '../constants';

type TGetAccountNameProps = {
    accountCategory: THooks.TransferAccount['account_category'];
    accountType: THooks.TransferAccount['account_type'];
    displayCurrencyCode?: THooks.CurrencyConfig['display_code'];
    landingCompanyName: TWalletLandingCompanyName;
    mt5MarketType?: TMarketTypes.SortedMT5Accounts;
};

//TODO: remove this function when market_type will be added to transfer_between_accounts response in API
export const getMarketType = (mt5Group?: string) => {
    if (mt5Group?.includes('financial')) return 'financial';
    if (mt5Group?.includes('synthetic')) return 'synthetic';
    if (mt5Group?.includes('all')) return 'all';
    return 'all';
};

//TODO: remove this function when landing_company_name will be added to transfer_between_accounts response in API for mt5 accounts
export const getLandingCompanyNameOfMT5Account = (mt5Group?: string) => {
    if (mt5Group?.includes('bvi')) return 'bvi';
    if (mt5Group?.includes('labuan')) return 'labuan';
    if (mt5Group?.includes('svg')) return 'svg';
    if (mt5Group?.includes('vanuatu')) return 'vanuatu';
    return 'svg';
};

export const getWalletIcon = (currency: string, isDemo: boolean) => {
    return isDemo ? walletIconMapper.Demo?.light : walletIconMapper[currency as keyof typeof walletIconMapper]?.light;
};

export const getTradingAppIcon = (
    accountType: string,
    landingCompanyName: TWalletLandingCompanyName,
    mt5Group?: string
) => {
    const marketType = getMarketType(mt5Group);

    if (accountType === 'mt5') {
        if (marketType === 'financial') {
            return appIconMapper.mt5.financial[landingCompanyName].light;
        }
        return appIconMapper.mt5[marketType].light;
    }
    //@ts-expect-error needs backend typing
    return appIconMapper[accountType]?.light;
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
                case 'binary':
                case 'standard':
                    return 'Deriv Apps';
                case 'dxtrade':
                    return 'Deriv X';
                case 'ctrader':
                    return 'Deriv cTrader';
                case 'mt5': {
                    switch (mt5MarketType) {
                        case 'financial':
                            return landingCompanyName === 'svg' ? 'MT5 Financial' : 'MT5 CFDs';
                        case 'synthetic':
                            return 'MT5 Derived';
                        case 'all':
                            return 'MT5 Swap-free';
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
