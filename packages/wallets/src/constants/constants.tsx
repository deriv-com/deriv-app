import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../helpers/urls';
import i18n from '../translations/i18n';

export const optionsAndMultipliersContent = [
    {
        description: i18n.t('The options and multipliers trading platform.'),
        key: 'trader',
        redirect: '/dtrader',
        title: i18n.t('Deriv Trader'),
    },
    {
        description: i18n.t('The ultimate bot trading platform.'),
        key: 'bot',
        redirect: '/bot',
        title: i18n.t('Deriv Bot'),
    },
    {
        description: i18n.t('The legacy options trading platform.'),
        isExternal: true,
        key: 'smarttrader',
        redirect: getUrlSmartTrader(),
        title: i18n.t('SmartTrader'),
    },
    {
        description: i18n.t('The legacy bot trading platform.'),
        isExternal: true,
        key: 'binarybot',
        redirect: getUrlBinaryBot(),
        title: i18n.t('Binary Bot'),
    },
    {
        description: i18n.t('The mobile app for trading multipliers and accumulators.'),
        isExternal: true,
        key: 'derivgo',
        redirect: getStaticUrl('/deriv-go'),
        title: i18n.t('Deriv GO'),
    },
];
