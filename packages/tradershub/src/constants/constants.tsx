import React from 'react';
import {
    CurrencyBtcIcon,
    CurrencyDemoIcon,
    CurrencyEthIcon,
    CurrencyEurIcon,
    CurrencyGbpIcon,
    CurrencyLtcIcon,
    CurrencyUsdcIcon,
    CurrencyUsdIcon,
    CurrencyUsdtIcon,
} from '@deriv/quill-icons';
import { PlatformIcon } from '../components';
import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../helpers/urls';

type IconToCurrencyMapperType = {
    [key: string]: {
        icon: React.ReactNode;
        text: string;
    };
};

export const optionsAndMultipliersContent = (isEU: boolean) => [
    {
        description: isEU ? 'Multipliers trading platform.' : 'Options and multipliers trading platform.',
        icon: <PlatformIcon icon='DTrader' />,
        redirect: '/',
        smallIcon: <PlatformIcon height='32px' icon='DTrader' width='32px' />,
        title: 'Deriv Trader',
    },
    {
        description: 'Automate your trading, no coding needed.',
        icon: <PlatformIcon icon='DBot' />,
        redirect: '/bot',
        smallIcon: <PlatformIcon height='32px' icon='DBot' width='32px' />,
        title: 'Deriv Bot',
    },
    {
        description: 'Our legacy options trading platform.',
        icon: <PlatformIcon icon='SmartTrader' />,
        isExternal: true,
        redirect: getUrlSmartTrader(),
        smallIcon: <PlatformIcon height='32px' icon='SmartTrader' width='32px' />,
        title: 'SmartTrader',
    },
    {
        description: 'Our legacy automated trading platform.',
        icon: <PlatformIcon icon='BinaryBot' />,
        isExternal: true,
        redirect: getUrlBinaryBot(),
        smallIcon: <PlatformIcon height='32px' icon='BinaryBot' width='32px' />,
        title: 'Binary Bot',
    },
    {
        description: 'Trade on the go with our mobile app.',
        icon: <PlatformIcon icon='DerivGo' />,
        isExternal: true,
        redirect: getStaticUrl('/deriv-go'),
        smallIcon: <PlatformIcon height='32px' icon='DerivGo' width='32px' />,
        title: 'Deriv GO',
    },
];

export const IconToCurrencyMapper: IconToCurrencyMapperType = {
    AUD: {
        icon: <CurrencyUsdIcon />,
        text: 'Australian Dollar',
    },
    BTC: {
        icon: <CurrencyBtcIcon />,
        text: 'Bitcoin',
    },
    ETH: {
        icon: <CurrencyEthIcon />,
        text: 'Ethereum',
    },
    EUR: {
        icon: <CurrencyEurIcon />,
        text: 'Euro',
    },
    eUSDT: {
        icon: <CurrencyUsdtIcon />,
        text: 'Tether ERC20',
    },
    GBP: {
        icon: <CurrencyGbpIcon />,
        text: 'Pound Sterling',
    },
    LTC: {
        icon: <CurrencyLtcIcon />,
        text: 'Litecoin',
    },
    tUSDT: {
        icon: <CurrencyUsdtIcon />,
        text: 'Tether TRC20',
    },
    USD: {
        icon: <CurrencyUsdIcon />,
        text: 'US Dollar',
    },
    USDC: {
        icon: <CurrencyUsdcIcon />,
        text: 'USD Coin',
    },
    UST: {
        icon: <CurrencyUsdtIcon />,
        text: 'Tether',
    },
    virtual: {
        icon: <CurrencyDemoIcon />,
        text: 'Demo',
    },
};

export const Regulation = {
    EU: 'EU',
    NonEU: 'Non-EU',
} as const;

export const BrokerCodes = {
    CR: 'CR',
    MF: 'MF',
} as const;
