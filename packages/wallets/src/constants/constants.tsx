import React from 'react';
import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../helpers/urls';
import IcAppstoreBinaryBot from '../public/images/ic-appstore-binary-bot.svg';
import IcAppstoreDerivBot from '../public/images/ic-appstore-deriv-bot.svg';
import IcAppstoreDerivGo from '../public/images/ic-appstore-deriv-go.svg';
import IcAppstoreDerivTrader from '../public/images/ic-appstore-deriv-trader.svg';
import IcAppstoreSmartTrader from '../public/images/ic-appstore-smart-trader.svg';
import i18n from '../translations/i18n';

export const optionsAndMultipliersContent = [
    {
        description: i18n.t('Options and multipliers trading platform.'),
        icon: <IcAppstoreDerivTrader />,
        redirect: '/',
        smallIcon: <IcAppstoreDerivTrader height='3.2rem' width='3.2rem' />,
        title: i18n.t('Deriv Trader'),
    },
    {
        description: i18n.t('Automate your trading, no coding needed.'),
        icon: <IcAppstoreDerivBot />,
        redirect: '/bot',
        smallIcon: <IcAppstoreDerivBot height='3.2rem' width='3.2rem' />,
        title: i18n.t('Deriv Bot'),
    },
    {
        description: i18n.t('Our legacy options trading platform.'),
        icon: <IcAppstoreSmartTrader />,
        isExternal: true,
        redirect: getUrlSmartTrader(),
        smallIcon: <IcAppstoreSmartTrader height='3.2rem' width='3.2rem' />,
        title: i18n.t('SmartTrader'),
    },
    {
        description: i18n.t('Our legacy automated trading platform.'),
        icon: <IcAppstoreBinaryBot />,
        isExternal: true,
        redirect: getUrlBinaryBot(),
        smallIcon: <IcAppstoreBinaryBot height='3.2rem' width='3.2rem' />,
        title: i18n.t('Binary Bot'),
    },
    {
        description: i18n.t('Trade on the go with our mobile app.'),
        icon: <IcAppstoreDerivGo />,
        isExternal: true,
        redirect: getStaticUrl('/deriv-go'),
        smallIcon: <IcAppstoreDerivGo height='3.2rem' width='3.2rem' />,
        title: i18n.t('Deriv GO'),
    },
];
