import { getPlatformSettingsAppstore, routes } from '@deriv/shared';

import { localize } from '@deriv/translations';

const platform_config = [
    {
        icon: getPlatformSettingsAppstore('trader').icon,
        title: getPlatformSettingsAppstore('trader').name,
        name: getPlatformSettingsAppstore('trader').name,
        description: localize('Options & multipliers trading platform.'),
        link_to: routes.trade,
    },
    {
        icon: getPlatformSettingsAppstore('dbot').icon,
        title: getPlatformSettingsAppstore('dbot').name,
        name: getPlatformSettingsAppstore('dbot').name,
        description: localize('Automate your trading, no coding needed.'),
        link_to: routes.bot,
    },
    {
        icon: getPlatformSettingsAppstore('smarttrader').icon,
        title: getPlatformSettingsAppstore('smarttrader').name,
        name: getPlatformSettingsAppstore('smarttrader').name,
        description: localize('Our legacy options trading platform.'),
        href: routes.smarttrader,
    },
    {
        icon: getPlatformSettingsAppstore('bbot').icon,
        title: getPlatformSettingsAppstore('bbot').name,
        name: getPlatformSettingsAppstore('bbot').name,
        description: localize('Our legacy automated trading platform.'),
        href: routes.binarybot,
    },
    {
        icon: getPlatformSettingsAppstore('go').icon,
        title: getPlatformSettingsAppstore('go').name,
        name: getPlatformSettingsAppstore('go').name,
        description: localize('Trade on the go with our mobile app.'),
        link_to: routes.dxtrade,
    },
];

export default platform_config;
