import { getPlatformSettingsAppstore, routes, getStaticUrl } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Icons } from 'Assets/svgs/wallet';

export type AccountType = 'real' | 'demo';
export type RegionAvailability = 'all' | 'eu' | 'non-eu';

export interface PlatformConfig {
    app_icon: keyof typeof Icons;
    app_title: string;
    name: string;
    app_desc: string;
    href?: string;
    link_to?: string;
    availability?: RegionAvailability;
}

export const account_types: AccountType[] = ['real', 'demo'];

export const platform_config: PlatformConfig[] = [
    {
        app_icon: getPlatformSettingsAppstore('trader').icon,
        app_title: getPlatformSettingsAppstore('trader').name,
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('Options & multipliers trading platform.'),
        link_to: routes.trade,
        availability: 'all',
    },
    {
        app_icon: getPlatformSettingsAppstore('dbot').icon,
        app_title: getPlatformSettingsAppstore('dbot').name,
        name: getPlatformSettingsAppstore('dbot').name,
        app_desc: localize('Automate your trading, no coding needed.'),
        link_to: routes.bot,
        availability: 'non-eu',
    },
    {
        app_icon: getPlatformSettingsAppstore('smarttrader').icon,
        app_title: getPlatformSettingsAppstore('smarttrader').name,
        name: getPlatformSettingsAppstore('smarttrader').name,
        app_desc: localize('Our legacy options trading platform.'),
        href: routes.smarttrader,
        availability: 'non-eu',
    },
    {
        app_icon: getPlatformSettingsAppstore('bbot').icon,
        app_title: getPlatformSettingsAppstore('bbot').name,
        name: getPlatformSettingsAppstore('bbot').name,
        app_desc: localize('Our legacy automated trading platform.'),
        href: routes.binarybot,
        availability: 'non-eu',
    },
    {
        app_icon: getPlatformSettingsAppstore('go').icon,
        app_title: getPlatformSettingsAppstore('go').name,
        name: getPlatformSettingsAppstore('go').name,
        app_desc: localize('Trade on the go with our mobile app.'),
        href: getStaticUrl('/deriv-go'),
        availability: 'non-eu',
    },
];

export const mf_platform_config: PlatformConfig[] = [
    {
        app_icon: getPlatformSettingsAppstore('trader').icon,
        app_title: getPlatformSettingsAppstore('trader').name,
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('Options & multipliers trading platform.'),
        link_to: routes.trade,
    },
];
