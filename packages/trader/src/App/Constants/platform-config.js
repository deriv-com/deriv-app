import { localize } from '@deriv/translations';
import { routes } from 'Constants/index';
import { isBot } from 'Utils/PlatformSwitcher';

const key = isBot() ? 'href' : 'link_to';

const platform_config = [
    {
        icon: 'IcBrandDtrader',
        title: localize('DTrader'),
        description: localize('A whole new trading experience on a powerful yet easy to use platform.'),
        [key]: routes.trade,
    },
    {
        icon: 'IcBrandDbot',
        title: localize('DBot'),
        description: localize('Automate your trading ideas without coding.'),
        href: '/bot',
    },
    {
        icon: 'IcBrandDmt5',
        title: localize('DMT5'),
        description: localize('Trade with the platform of choice for professionals.'),
        [key]: routes.mt5,
    },
];

export default platform_config;
