import React from 'react';
import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../helpers/urls';
import i18n from '../translations/i18n';

export const optionsAndMultipliersContent = [
    {
        description: i18n.t('The options and multipliers trading platform.'),
        redirect: '/dtrader',
        title: i18n.t('Deriv Trader'),
        key: 'trader',
    },
    {
        description: i18n.t('The ultimate bot trading platform.'),
        redirect: '/bot',
        title: i18n.t('Deriv Bot'),
        key: 'bot',
    },
    {
        description: i18n.t('The legacy options trading platform.'),
        isExternal: true,
        redirect: getUrlSmartTrader(),
        title: i18n.t('SmartTrader'),
        key: 'smarttrader',
    },
    {
        description: i18n.t('The legacy bot trading platform.'),
        isExternal: true,
        redirect: getUrlBinaryBot(),
        title: i18n.t('Binary Bot'),
        key: 'binarybot',
    },
    {
        description: i18n.t('The mobile app for trading multipliers and accumulators.'),
        isExternal: true,
        redirect: getStaticUrl('/deriv-go'),
        title: i18n.t('Deriv GO'),
        key: 'derivgo',
    },
];
