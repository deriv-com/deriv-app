import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../helpers/urls';

export const optionsAndMultipliersContent = [
    {
        description: 'The options and multipliers trading platform.',
        key: 'trader',
        redirect: '/dtrader',
        title: 'Deriv Trader',
    },
    {
        description: 'The ultimate bot trading platform.',
        key: 'bot',
        redirect: '/bot',
        title: 'Deriv Bot',
    },
    {
        description: 'The legacy options trading platform.',
        isExternal: true,
        key: 'smarttrader',
        redirect: getUrlSmartTrader(),
        title: 'SmartTrader',
    },
    {
        description: 'The legacy bot trading platform.',
        isExternal: true,
        key: 'binarybot',
        redirect: getUrlBinaryBot(),
        title: 'Binary Bot',
    },
    {
        description: 'The mobile app for trading multipliers and accumulators.',
        isExternal: true,
        key: 'derivgo',
        redirect: getStaticUrl('/deriv-go'),
        title: 'Deriv GO',
    },
];
