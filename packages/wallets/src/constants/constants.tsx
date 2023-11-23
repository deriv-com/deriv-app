import React from 'react';
import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../helpers/urls';
import IcAppstoreBinaryBot from '../public/images/ic-appstore-binary-bot.svg';
import IcAppstoreDerivBot from '../public/images/ic-appstore-deriv-bot.svg';
import IcAppstoreDerivGo from '../public/images/ic-appstore-deriv-go.svg';
import IcAppstoreDerivTrader from '../public/images/ic-appstore-deriv-trader.svg';
import IcAppstoreSmartTrader from '../public/images/ic-appstore-smart-trader.svg';

export const optionsAndMultipliersContent = [
    {
        description: 'Options and multipliers trading platform.',
        icon: <IcAppstoreDerivTrader />,
        redirect: '/',
        title: 'Deriv Trader',
    },
    {
        description: 'Automate your trading, no coding needed.',
        icon: <IcAppstoreDerivBot />,
        redirect: '/bot',
        title: 'Deriv Bot',
    },
    {
        description: 'Our legacy options trading platform.',
        icon: <IcAppstoreSmartTrader />,
        isExternal: true,
        redirect: getUrlSmartTrader(),
        title: 'SmartTrader',
    },
    {
        description: 'Our legacy automated trading platform.',
        icon: <IcAppstoreBinaryBot />,
        isExternal: true,
        redirect: getUrlBinaryBot(),
        title: 'Binary Bot',
    },
    {
        description: 'Trade on the go with our mobile app.',
        icon: <IcAppstoreDerivGo />,
        isExternal: true,
        redirect: getStaticUrl('/deriv-go'),
        title: 'Deriv GO',
    },
];
