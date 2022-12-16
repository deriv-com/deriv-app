import { getPlatformSettingsAppstore, routes, getStaticUrl } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { PlatformIcons } from 'Assets/svgs/trading-platform';
import { TAccountCategory, TRegionAvailability } from 'Types';

export const account_types: TAccountCategory[] = ['real', 'demo'];
export const region_availability: TRegionAvailability[] = ['Non-EU', 'EU'];

export type BrandConfig = {
    name: string;
    icon: keyof typeof PlatformIcons;
    availability: TRegionAvailability;
};

export type PlatformConfig = {
    name: string;
    app_desc: string;
    link_to?: string;
};

export const platform_config: PlatformConfig[] = [
    {
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('Options & multipliers trading platform.'),
        link_to: routes.trade,
    },
    {
        name: getPlatformSettingsAppstore('dbot').name,
        app_desc: localize('Automate your trading, no coding needed.'),
        link_to: routes.bot,
    },
    {
        name: getPlatformSettingsAppstore('smarttrader').name,
        app_desc: localize('Our legacy options trading platform.'),
        link_to: routes.smarttrader,
    },
    {
        name: getPlatformSettingsAppstore('bbot').name,
        app_desc: localize('Our legacy automated trading platform.'),
        link_to: routes.binarybot,
    },
    {
        name: getPlatformSettingsAppstore('go').name,
        app_desc: localize('Trade on the go with our mobile app.'),
        link_to: getStaticUrl('/deriv-go'),
    },
];

// TODO: To be removed once refactor is complete. DO NOT USE
export const mf_platform_config = [
    {
        app_icon: getPlatformSettingsAppstore('trader').icon,
        app_title: getPlatformSettingsAppstore('trader').name,
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('Options & multipliers trading platform.'),
        link_to: routes.trade,
    },
];
