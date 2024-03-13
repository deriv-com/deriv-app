import React from 'react';
import {
    CurrencyAudIcon,
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
import { URLUtils } from '@deriv-com/utils';
import { IconComponent } from '../components';
import { getUrlBinaryBot, getUrlSmartTrader } from '../helpers/urls';

const { getDerivStaticURL } = URLUtils;

export type IconToCurrencyMapperType = {
    [key: string]: {
        icon: React.ReactNode;
        text: string;
    };
};

export const optionsAndMultipliersContent = (isEU: boolean) => [
    {
        description: isEU ? 'Multipliers trading platform.' : 'Options and multipliers trading platform.',
        icon: <IconComponent icon='DTrader' />,
        redirect: '/',
        smallIcon: <IconComponent height={32} icon='DTrader' width={32} />,
        title: 'Deriv Trader',
    },
    {
        description: 'Automate your trading, no coding needed.',
        icon: <IconComponent icon='DBot' />,
        redirect: '/bot',
        smallIcon: <IconComponent height={32} icon='DBot' width={32} />,
        title: 'Deriv Bot',
    },
    {
        description: 'Our legacy options trading platform.',
        icon: <IconComponent icon='SmartTrader' />,
        isExternal: true,
        redirect: getUrlSmartTrader(),
        smallIcon: <IconComponent height={32} icon='SmartTrader' width={32} />,
        title: 'SmartTrader',
    },
    {
        description: 'Our legacy automated trading platform.',
        icon: <IconComponent icon='BinaryBot' />,
        isExternal: true,
        redirect: getUrlBinaryBot(),
        smallIcon: <IconComponent height={32} icon='BinaryBot' width={32} />,
        title: 'Binary Bot',
    },
    {
        description: 'Trade on the go with our mobile app.',
        icon: <IconComponent icon='DerivGo' />,
        isExternal: true,
        redirect: getDerivStaticURL('/deriv-go'),
        smallIcon: <IconComponent height={32} icon='DerivGo' width={32} />,
        title: 'Deriv GO',
    },
];

export const IconToCurrencyMapper: IconToCurrencyMapperType = {
    AUD: {
        icon: <CurrencyAudIcon />,
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

export const CurrencyTypes = {
    CRYPTO: 'CRYPTO',
    FIAT: 'FIAT',
} as const;

export const Regulation = {
    EU: 'EU',
    NonEU: 'Non-EU',
} as const;

export const BrokerCodes = {
    CR: 'CR',
    MF: 'MF',
} as const;

export const CurrenciesListOrder: {
    CRYPTO: string[];
    FIAT: string[];
} = {
    FIAT: ['USD', 'EUR', 'GBP', 'AUD'],
    CRYPTO: ['TUSDT', 'BTC', 'ETH', 'LTC', 'UST', 'eUSDT', 'BUSD', 'DAI', 'EURS', 'IDK', 'PAX', 'TUSD', 'USDC', 'USDK'],
};
