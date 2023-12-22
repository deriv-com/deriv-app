import React, { ReactNode } from 'react';
import CTraderIcon from '../../public/images/cfd/ctrader.svg';
import DerivXIcon from '../../public/images/cfd/derivx.svg';
import DerivedMT5Icon from '../../public/images/cfd/mt5-derived.svg';
import FinancialMT5Icon from '../../public/images/cfd/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/cfd/mt5-swap-free.svg';
import CTraderLabelIcon from '../../public/images/ctrader-label.svg';
import DerivXLabelIcon from '../../public/images/derivx-label.svg';
import LinuxIcon from '../../public/images/ic-linux-logo.svg';
import MacOSIcon from '../../public/images/ic-macos-logo.svg';
import MT5Icon from '../../public/images/ic-mt5.svg';
import WindowsIcon from '../../public/images/ic-windows-logo.svg';
import { TPlatforms } from '../../types';

type TAppContent = {
    icon: ReactNode;
    link: string;
    text: string;
    title: string;
};

type TPlatform = 'ctrader' | 'linux' | 'macos' | 'web' | 'windows';

type TAppToContentMapper = {
    [key in TPlatform]: TAppContent;
};

export const MarketTypeDetails = {
    all: {
        description:
            'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs',
        icon: <SwapFreeMT5Icon />,
        title: 'Swap-Free',
    },
    financial: {
        description: 'This account offers CFDs on financial instruments.',
        icon: <FinancialMT5Icon />,
        title: 'Financial',
    },
    synthetic: {
        description: 'This account offers CFDs on derived instruments.',
        icon: <DerivedMT5Icon />,
        title: 'Derived',
    },
} as const;

export const PlatformDetails = {
    ctrader: {
        icon: <CTraderIcon />,
        link: 'https://onelink.to/hyqpv7',
        platform: 'ctrader' as TPlatforms.OtherAccounts,
        title: 'Deriv cTrader',
    },
    dxtrade: {
        icon: <DerivXIcon />,
        link: 'https://onelink.to/grmtyx',
        platform: 'dxtrade' as TPlatforms.OtherAccounts,
        title: 'Deriv X',
    },
    mt5: {
        icon: <DerivedMT5Icon />,
        link: 'https://onelink.to/grmtyx',
        platform: 'mt5' as TPlatforms.MT5,
        title: 'Deriv MT5',
    },
} as const;

export const companyNamesAndUrls = {
    bvi: { name: 'Deriv (BVI) Ltd', shortcode: 'BVI', tncUrl: 'tnc/deriv-(bvi)-ltd.pdf' },
    labuan: { name: 'Deriv (FX) Ltd', shortcode: 'Labuan', tncUrl: 'tnc/deriv-(fx)-ltd.pdf' },
    maltainvest: {
        name: 'Deriv Investments (Europe) Limited',
        shortcode: 'Maltainvest',
        tncUrl: 'tnc/deriv-investments-(europe)-limited.pdf',
    },
    svg: { name: 'Deriv (SVG) LLC', shortcode: 'SVG', tncUrl: 'tnc/deriv-(svg)-llc.pdf' },
    vanuatu: { name: 'Deriv (V) Ltd', shortcode: 'Vanuatu', tncUrl: 'tnc/general-terms.pdf' },
} as const;

export const CFDPlatforms = {
    CFDS: 'CFDs',
    CTRADER: 'ctrader',
    DXTRADE: 'dxtrade',
    MT5: 'mt5',
} as const;

export const MarketType = {
    ALL: 'all',
    FINANCIAL: 'financial',
    SYNTHETIC: 'synthetic',
} as const;

export const AppToContentMapper: TAppToContentMapper = {
    ctrader: {
        icon: <WindowsIcon />,
        link: 'https://getctrader.com/deriv/ctrader-deriv-setup.exe',
        text: 'Download',
        title: 'CTrader Windows App',
    },
    linux: {
        icon: <LinuxIcon />,
        link: 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux',
        text: 'Learn more',
        title: 'MetaTrader 5 Linux app',
    },
    macos: {
        icon: <MacOSIcon />,
        link: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg',
        text: 'Download',
        title: 'MetaTrader 5 MacOS app',
    },
    web: {
        icon: <MT5Icon />,
        link: '',
        text: 'Open',
        title: 'MetaTrader 5 web',
    },
    windows: {
        icon: <WindowsIcon />,
        link: 'https://download.mql5.com/cdn/web/deriv.com.limited/mt5/deriv5setup.exe',
        text: 'Download',
        title: 'MetaTrader 5 Windows app',
    },
};

export const PlatformToLabelIconMapper = {
    ctrader: <CTraderLabelIcon />,
    dxtrade: <DerivXLabelIcon />,
};

export const PlatformUrls = {
    ctrader: {
        live: 'https://ct.deriv.com',
        staging: 'https://ct-uat.deriv.com',
    },
    dxtrade: {
        demo: 'https://dx-demo.deriv.com',
        live: 'https://dx.deriv.com',
    },
} as const;
