import { platforms_appstore, routes } from '@deriv/shared';

import { localize } from '@deriv/translations';

const platform_config = [
    {
        icon: platforms_appstore('trader').icon,
        title: platforms_appstore('trader').name,
        name: platforms_appstore('trader').name,
        description: localize('A whole new trading experience on a powerful yet easy to use platform.'),
        link_to: routes.trade,
    },
    {
        icon: platforms_appstore('dbot').icon,
        title: platforms_appstore('dbot').name,
        name: platforms_appstore('dbot').name,
        description: localize('Automated trading at your fingertips. No coding needed.'),
        link_to: routes.bot,
    },
    {
        icon: platforms_appstore('smarttrader').icon,
        title: platforms_appstore('smarttrader').name,
        name: platforms_appstore('smarttrader').name,
        description: localize('Trade the world’s markets with our popular user-friendly platform.'),
        link_to: routes.smarttrader,
    },
    {
        icon: platforms_appstore('bbot').icon,
        title: platforms_appstore('bbot').name,
        name: platforms_appstore('bbot').name,
        description: localize(
            'Our classic “drag-and-drop” tool for creating trading bots, featuring pop-up trading charts, for advanced users.'
        ),
        link_to: routes.binarybot,
    },
];

export default platform_config;
