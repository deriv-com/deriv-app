import { routes } from '@deriv/shared';

import { localize } from '@deriv/translations';

const platform_config = [
    {
        icon: 'IcBrandDtrader',
        title: () => localize('DTrader'),
        name: 'DTrader',
        description: () => localize('A whole new trading experience on a powerful yet easy to use platform.'),
        link_to: routes.trade,
    },
    {
        icon: 'IcBrandDbot',
        title: () => localize('DBot'),
        name: 'DBot',
        description: () => localize('Automated trading at your fingertips. No coding needed.'),
        link_to: routes.bot,
    },
    {
        icon: 'IcBrandDmt5',
        title: () => localize('DMT5'),
        name: 'DMT5',
        description: () => localize('Trade on Deriv MT5 (DMT5), the all-in-one FX and CFD trading platform.'),
        link_to: routes.mt5,
    },
    {
        icon: 'IcBrandDxtrade',
        title: () => localize('Deriv X'),
        name: 'Deriv X',
        description: () => localize('Trade FX and CFDs on a customisable, easy-to-use trading platform.'),
        link_to: routes.dxtrade,
    },
    {
        icon: 'IcBrandSmarttrader',
        title: () => localize('SmartTrader'),
        name: 'SmartTrader',
        description: () => localize('Trade the world’s markets with our popular user-friendly platform'),
        href: routes.smarttrader,
    },
    {
        icon: 'IcBrandBinarybot',
        title: () => localize('Binary Bot'),
        name: 'Binary Bot',
        description: () =>
            localize(
                'Our classic “drag-and-drop” tool for creating trading bots, featuring pop-up trading charts, for advanced users.'
            ),
        href: routes.binarybot,
    },
];

export default platform_config;
