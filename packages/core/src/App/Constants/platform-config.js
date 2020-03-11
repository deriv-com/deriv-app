import { localize } from '@deriv/translations';
import { routes } from 'Constants/index';

const platform_config = [
    {
        icon: 'IcBrandDtrader',
        title: localize('DTrader'),
        description: localize('A whole new trading experience on a powerful yet easy to use platform.'),
        link_to: routes.trade,
    },
    {
        icon: 'IcBrandDbot',
        title: localize('DBot'),
        description: localize('Automated trading at your fingertips. No coding needed.'),
        link_to: routes.bot,
    },
    {
        icon: 'IcBrandDmt5',
        title: localize('DMT5'),
        description: localize('The platform of choice for professionals worldwide.'),
        link_to: routes.mt5,
    },
    {
        icon: 'IcBrandSmarttrader',
        title: localize('SmartTrader'),
        description: localize("Trade the world's market with a simple and familiar platform"),
        href: routes.smarttrader,
    },
];

export default platform_config;
