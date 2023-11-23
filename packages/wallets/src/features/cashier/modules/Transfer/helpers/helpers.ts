import { THooks, TMarketTypes, TWalletLandingCompanyName } from '../../../../../types';
import { TAccount } from '../types';

type TGetAccountNameProps = {
    accountCategory: THooks.TransferAccount['account_category'];
    accountType: THooks.TransferAccount['account_type'];
    activeWalletLandingCompanyName: TWalletLandingCompanyName;
    displayCurrencyCode?: THooks.CurrencyConfig['display_code'];
    isDemo: THooks.ActiveWalletAccount['is_virtual'];
    mt5MarketType: TMarketTypes.SortedMT5Accounts;
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

export const getActiveWalletIcon = (activeWallet: TAccount) => {
    return activeWallet?.demo_account
        ? activeWalletIconMapper.Demo?.light
        : activeWalletIconMapper[activeWallet?.currency as keyof typeof activeWalletIconMapper]?.light;
};

export const getTradingAppIcon = (account: TAccount, activeWalletLandingCompanyName?: TWalletLandingCompanyName) => {
    if (account?.account_category !== 'trading') return '';
    if (!activeWalletLandingCompanyName) return '';

    const marketType = getMarketType(account.mt5_group);

    if (account.account_type === 'mt5') {
        if (marketType === 'financial') {
            return account.demo_account
                ? appIconMapper.mt5.financial.svg.light
                : appIconMapper.mt5.financial[activeWalletLandingCompanyName]?.light;
        }
        return appIconMapper.mt5[marketType].light;
    }
    //@ts-expect-error provide proper type for accounts from transfer_between_accounts response
    return appIconMapper[account.account_type]?.light;
};

export const getAccountName = ({
    accountCategory,
    accountType,
    activeWalletLandingCompanyName,
    displayCurrencyCode,
    isDemo,
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
                            return activeWalletLandingCompanyName === 'svg' || isDemo ? 'MT5 Financial' : 'MT5 CFDs';
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

const activeWalletIconMapper = {
    AUD: {
        dark: 'IcWalletCurrencyAud',
        light: 'IcWalletCurrencyAud',
    },
    BTC: {
        dark: 'IcWalletBitcoinDark',
        light: 'IcWalletBitcoinLight',
    },
    Demo: {
        dark: 'IcWalletDerivDemoDark',
        light: 'IcWalletDerivDemoLight',
    },
    ETH: {
        dark: 'IcWalletEthereumDark',
        light: 'IcWalletEthereumLight',
    },
    EUR: {
        dark: 'IcWalletCurrencyEur',
        light: 'IcWalletCurrencyEur',
    },
    eUST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    GBP: {
        dark: 'IcWalletCurrencyGbp',
        light: 'IcWalletCurrencyGbp',
    },
    LTC: {
        dark: 'IcWalletLiteCoinDark',
        light: 'IcWalletLiteCoinLight',
    },
    tUST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    USD: {
        dark: 'IcWalletCurrencyUsd',
        light: 'IcWalletCurrencyUsd',
    },
    USDC: {
        dark: 'IcWalletUsdCoinDark',
        light: 'IcWalletUsdCoinLight',
    },
    UST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
} as const;

const appIconMapper = {
    binary: {
        dark: 'IcWalletOptionsDark',
        light: 'IcWalletOptionsLight',
    },
    ctrader: {
        dark: 'IcWalletCTrader',
        light: 'IcWalletCTrader',
    },
    derivez: {
        dark: 'IcWalletDerivEZ',
        light: 'IcWalletDerivEZ',
    },
    dxtrade: {
        dark: 'IcWalletDerivX',
        light: 'IcWalletDerivX',
    },
    mt5: {
        all: {
            dark: 'IcWalletMt5All',
            light: 'IcWalletMt5All',
        },
        financial: {
            malta: {
                dark: 'IcWalletMt5CFDs',
                light: 'IcWalletMt5CFDs',
            },
            svg: {
                dark: 'IcWalletMt5Financial',
                light: 'IcWalletMt5Financial',
            },
        },
        synthetic: {
            dark: 'IcWalletMt5Derived',
            light: 'IcWalletMt5Derived',
        },
    },
    standard: {
        dark: 'IcWalletOptionsDark',
        light: 'IcWalletOptionsLight',
    },
} as const;
