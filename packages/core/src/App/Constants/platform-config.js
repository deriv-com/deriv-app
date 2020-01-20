import { localize } from '@deriv/translations';
import { routes }   from 'Constants/index';

const platform_config = [
    {
        icon       : 'IcBrandDtrader',
        title      : localize('DTrader'),
        description: localize('Start trading now with a powerful, yet easy-to-use platform.'),
        link_to    : routes.trade,
    },
    {
        icon       : 'IcBrandDbot',
        title      : localize('DBot'),
        description: localize('Automate your trading ideas without coding.'),
        link_to    : routes.bot,
    },
    {
        icon       : 'IcBrandDmt5',
        title      : localize('DMT5'),
        description: localize('Trade with the platform of choice for professionals.'),
        link_to    : routes.mt5,
    },
];

export default platform_config;
