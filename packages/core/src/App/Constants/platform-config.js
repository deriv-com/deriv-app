import { getPlatformSettings, routes } from '@deriv/shared';

import { localize } from '@deriv/translations';

const platform_config = [
    {
        icon: getPlatformSettings('trader').icon,
        title: () => getPlatformSettings('trader').name,
        name: getPlatformSettings('trader').name,
        description: () => localize('A whole new trading experience on a powerful yet easy to use platform.'),
        link_to: routes.trade,
    },
    {
        icon: getPlatformSettings('dbot').icon,
        title: () => getPlatformSettings('dbot').name,
        name: getPlatformSettings('dbot').name,
        description: () => localize('Automated trading at your fingertips. No coding needed.'),
        link_to: routes.bot,
    },
    {
        icon: getPlatformSettings('smarttrader').icon,
        title: () => getPlatformSettings('smarttrader').name,
        name: getPlatformSettings('smarttrader').name,
        description: () => localize('Trade the world’s markets with our popular user-friendly platform.'),
        href: routes.smarttrader,
    },
    {
        icon: getPlatformSettings('bbot').icon,
        title: () => getPlatformSettings('bbot').name,
        name: getPlatformSettings('bbot').name,
        description: () =>
            localize(
                'Our classic “drag-and-drop” tool for creating trading bots, featuring pop-up trading charts, for advanced users.'
            ),
        href: routes.binarybot,
    },
];

export default platform_config;
