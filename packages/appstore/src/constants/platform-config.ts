import { getPlatformSettingsAppstore, routes, getStaticUrl } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const platform_config = [
    {
        app_icon: getPlatformSettingsAppstore('trader').icon,
        app_title: getPlatformSettingsAppstore('trader').name,
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('Options & multipliers trading platform.'),
        link_to: routes.trade,
    },
    {
        app_icon: getPlatformSettingsAppstore('dbot').icon,
        app_title: getPlatformSettingsAppstore('dbot').name,
        name: getPlatformSettingsAppstore('dbot').name,
        app_desc: localize('Automate your trading, no coding needed.'),
        link_to: routes.bot,
    },
    {
        app_icon: getPlatformSettingsAppstore('smarttrader').icon,
        app_title: getPlatformSettingsAppstore('smarttrader').name,
        name: getPlatformSettingsAppstore('smarttrader').name,
        app_desc: localize('Our legacy options trading platform.'),
        href: routes.smarttrader,
    },
    {
        app_icon: getPlatformSettingsAppstore('bbot').icon,
        app_title: getPlatformSettingsAppstore('bbot').name,
        name: getPlatformSettingsAppstore('bbot').name,
        app_desc: localize('Our legacy automated trading platform.'),
        href: routes.binarybot,
    },
    {
        app_icon: getPlatformSettingsAppstore('go').icon,
        app_title: getPlatformSettingsAppstore('go').name,
        name: getPlatformSettingsAppstore('go').name,
        app_desc: localize('Trade on the go with our mobile app.'),
        href: getStaticUrl('/deriv-go'),
    },
];

export const mf_platform_config = [
    {
        app_icon: getPlatformSettingsAppstore('trader').icon,
        app_title: getPlatformSettingsAppstore('trader').name,
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('Options & multipliers trading platform.'),
        link_to: routes.trade,
    },
];
