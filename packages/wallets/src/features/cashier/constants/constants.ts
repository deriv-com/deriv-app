import { TMarketTypes, TMT5LandingCompanyName, TWalletLandingCompanyName } from '../../../types';

export const walletIconMapper = {
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

type TDefinedMT5LandingCompanyName = Exclude<TMT5LandingCompanyName, undefined>;

export const LandingCompanyDetails = {
    bvi: {
        name: 'bvi' as TDefinedMT5LandingCompanyName,
        shortcode: 'BVI',
    },
    labuan: {
        name: 'labuan' as TDefinedMT5LandingCompanyName,
        shortcode: 'Labuan',
    },
    maltainvest: {
        name: 'maltainvest' as TDefinedMT5LandingCompanyName,
        shortcode: 'Maltainvest',
    },
    svg: {
        name: 'svg' as TDefinedMT5LandingCompanyName,
        shortcode: 'SVG',
    },
    vanuatu: {
        name: 'vanuatu' as TDefinedMT5LandingCompanyName,
        shortcode: 'Vanuatu',
    },
} as const;

export const MT5MarketTypeDetails = {
    all: {
        icon: {
            dark: 'IcWalletMt5All',
            light: 'IcWalletMt5All',
        },
        name: 'all' as TMarketTypes.All,
        title: 'MT5 Swap-Free',
    },
    financial: {
        landingCompany: {
            malta: {
                icon: {
                    dark: 'IcWalletMt5CFDs',
                    light: 'IcWalletMt5CFDs',
                },
                name: 'malta' as TWalletLandingCompanyName,
                title: 'MT5 CFDs',
            },
            svg: {
                icon: {
                    dark: 'IcWalletMt5Financial',
                    light: 'IcWalletMt5Financial',
                },
                name: 'svg' as TWalletLandingCompanyName,
                title: 'MT5 Financial',
            },
            virtual: {
                icon: {
                    dark: 'IcWalletMt5Financial',
                    light: 'IcWalletMt5Financial',
                },
                name: 'virtual' as TWalletLandingCompanyName,
                title: 'MT5 CFDs',
            },
        },
        name: 'financial' as TMarketTypes.All,
        title: 'MT5 Financial',
    },
    synthetic: {
        icon: {
            dark: 'IcWalletMt5Derived',
            light: 'IcWalletMt5Derived',
        },
        name: 'synthetic' as TMarketTypes.All,
        title: 'MT5 Derived',
    },
} as const;

export const PlatformDetails = {
    binary: {
        icon: {
            dark: 'IcWalletOptionsDark',
            light: 'IcWalletOptionsLight',
        },
        name: 'binary',
        title: 'BinaryBot',
    },
    ctrader: {
        icon: {
            dark: 'IcWalletCTrader',
            light: 'IcWalletCTrader',
        },
        name: 'ctrader',
        title: 'Deriv cTrader',
    },
    derivez: {
        icon: {
            dark: 'IcWalletDerivEZ',
            light: 'IcWalletDerivEZ',
        },
        name: 'derivez',
        title: 'DerivEZ',
    },
    dxtrade: {
        icon: {
            dark: 'IcWalletDerivX',
            light: 'IcWalletDerivX',
        },
        name: 'dxtrade',
        title: 'Deriv X',
    },
    mt5: {
        marketType: { ...MT5MarketTypeDetails },
        name: 'mt5',
        title: 'Deriv MT5',
    },
    standard: {
        icon: {
            dark: 'IcWalletOptionsDark',
            light: 'IcWalletOptionsLight',
        },
        name: 'standard',
        title: 'Deriv Apps',
    },
} as const;
