import React from 'react';
import {
    AccountsDerivCtraderIcon,
    AccountsDerivXIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5StandardIcon,
    AccountsDmt5SwfIcon,
    DerivProductDerivXBrandDarkWordmarkIcon,
    LabelPairedLinuxXlIcon,
    LabelPairedMacosXlIcon,
    LabelPairedWindowsXlIcon,
    PartnersProductDerivCtraderBrandDarkWordmarkHorizontalIcon,
    PartnersProductDerivMt5BrandLightLogoHorizontalIcon,
} from '@deriv/quill-icons';
import i18n from '../../translations/i18n';
import { TPlatforms } from '../../types';
import { ctraderLinks, whiteLabelLinks } from './screens/MT5TradeScreen/MT5TradeLink/urlConfig';

export const MarketTypeDetails = {
    all: {
        description: i18n.t('Swap-free CFDs on selected financial and derived instruments'),
        icon: <AccountsDmt5SwfIcon height={48} width={48} />,
        title: i18n.t('Swap-Free'),
    },
    financial: {
        description: i18n.t('CFDs on financial instruments'),
        icon: <AccountsDmt5FinancialIcon height={48} width={48} />,
        title: i18n.t('Financial'),
    },
    synthetic: {
        description: i18n.t('CFDs on derived and financial instruments'),
        icon: <AccountsDmt5StandardIcon height={48} width={48} />,
        title: i18n.t('Standard'),
    },
} as const;

export const PlatformDetails = {
    ctrader: {
        icon: <AccountsDerivCtraderIcon height={48} width={48} />,
        link: 'https://onelink.to/5jgj8z',
        platform: i18n.t('ctrader') as TPlatforms.OtherAccounts,
        title: i18n.t('Deriv cTrader'),
    },
    dxtrade: {
        icon: <AccountsDerivXIcon height={48} width={48} />,
        link: 'https://onelink.to/grmtyx',
        platform: i18n.t('dxtrade') as TPlatforms.OtherAccounts,
        title: i18n.t('Deriv X'),
    },
    mt5: {
        icon: <AccountsDmt5StandardIcon height={48} width={48} />,
        link: 'https://onelink.to/xf26jx',
        platform: i18n.t('mt5') as TPlatforms.MT5,
        title: i18n.t('Deriv MT5'),
    },
    mt5Investor: {
        icon: <AccountsDmt5StandardIcon height={48} width={48} />,
        link: 'https://onelink.to/xf26jx',
        platform: i18n.t('mt5') as TPlatforms.MT5,
        title: i18n.t('Deriv MT5 investor'),
    },
} as const;

export const companyNamesAndUrls = {
    bvi: { name: i18n.t('Deriv (BVI) Ltd'), shortcode: 'BVI', tncUrl: 'tnc/deriv-(bvi)-ltd.pdf' },
    labuan: { name: i18n.t('Deriv (FX) Ltd'), shortcode: 'Labuan', tncUrl: 'tnc/deriv-(fx)-ltd.pdf' },
    maltainvest: {
        name: i18n.t('Deriv Investments (Europe) Limited'),
        shortcode: 'Maltainvest',
        tncUrl: 'tnc/deriv-investments-(europe)-limited.pdf',
    },
    svg: { name: i18n.t('Deriv (SVG) LLC'), shortcode: 'SVG', tncUrl: 'tnc/deriv-(svg)-llc.pdf' },
    vanuatu: { name: i18n.t('Deriv (V) Ltd'), shortcode: 'Vanuatu', tncUrl: 'tnc/general-terms.pdf' },
} as const;

export const AppToContentMapper = {
    ctrader: {
        icon: <LabelPairedWindowsXlIcon />,
        link: ctraderLinks.windows,
        text: i18n.t('Download'),
        title: i18n.t('CTrader Windows App'),
    },
    linux: {
        icon: <LabelPairedLinuxXlIcon />,
        link: whiteLabelLinks.linux,
        text: i18n.t('Learn more'),
        title: i18n.t('MetaTrader 5 Linux app'),
    },
    macos: {
        icon: <LabelPairedMacosXlIcon />,
        link: whiteLabelLinks.macos,
        text: i18n.t('Download'),
        title: i18n.t('MetaTrader 5 MacOS app'),
    },
    web: {
        icon: <PartnersProductDerivMt5BrandLightLogoHorizontalIcon height={32} width={32} />,
        link: whiteLabelLinks.webtrader_url,
        text: i18n.t('Open'),
        title: i18n.t('MetaTrader 5 web'),
    },
    windows: {
        icon: <LabelPairedWindowsXlIcon />,
        link: whiteLabelLinks.windows,
        text: i18n.t('Download'),
        title: i18n.t('MetaTrader 5 Windows app'),
    },
} as const;

export const PlatformToLabelIconMapper = {
    ctrader: <PartnersProductDerivCtraderBrandDarkWordmarkHorizontalIcon height={8} width={58} />,
    dxtrade: <DerivProductDerivXBrandDarkWordmarkIcon height={10} width={35} />,
} as const;

export const serviceMaintenanceMessages = {
    ctrader:
        'Server maintenance occurs every first Saturday of the month from 7 to 10 GMT time. You may experience service disruption during this time.',
    dxtrade:
        'Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. You may experience service disruption during this time.',
    mt5: 'Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to complete. Service may be disrupted during this time.',
} as const;

export const CFD_PLATFORMS = {
    CFDS: 'CFDs',
    CTRADER: 'ctrader',
    DXTRADE: 'dxtrade',
    MT5: 'mt5',
} as const;

export const DESKTOP_PLATFORMS = {
    LINUX: 'linux',
    MACOS: 'macos',
    WINDOWS: 'windows',
} as const;

export const MOBILE_PLATFORMS = {
    ANDROID: 'android',
    HAUWEI: 'huawei',
    IOS: 'ios',
} as const;

export const MARKET_TYPE = {
    ALL: 'all',
    FINANCIAL: 'financial',
    SYNTHETIC: 'synthetic',
} as const;

export const JURISDICTION = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTA_INVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;
