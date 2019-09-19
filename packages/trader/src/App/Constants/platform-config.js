import { localize } from 'App/i18n';
import { routes }   from 'Constants/index';

const platform_config = [
    {
        icon       : 'IconDTrader',
        title      : localize('DTrader'),
        description: localize('Everything you need to trade the markets you want'),
        link_to    : routes.trade,
    },
    {
        icon       : 'IconDBot',
        title      : localize('DBot'),
        description: localize('A powerful robot builder to automate your trading strategies'),
        href       : '/bot',
    },
    {
        icon       : 'IconMT5',
        title      : localize('MetaTrader 5'),
        description: localize('An all-in-one platform for FX and CFD Trading'),
        link_to    : routes.error404, // TODO: Change this when MT5 is merged. e.g routes.mt5
    },
];

export default platform_config;
