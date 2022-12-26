import { getPlatformSettingsAppstore, routes, getStaticUrl } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { PlatformIcons } from 'Assets/svgs/trading-platform';
import { TRegionAvailability } from 'Types';

export type AccountType = { text: 'Real' | 'Demo'; value: 'real' | 'demo' };
export type RegionAvailability = 'Non-EU' | 'EU' | 'All';
export const account_types: AccountType[] = [
    { text: 'Demo', value: 'demo' },
    { text: 'Real', value: 'real' },
];
export const region_availability: RegionAvailability[] = ['Non-EU', 'EU'];

export type BrandConfig = {
    name: string;
    icon: keyof typeof PlatformIcons;
    availability: TRegionAvailability;
    is_deriv_platform?: boolean;
};

export type PlatformConfig = {
    name: string;
    app_desc: string;
    link_to?: string;
};

export type MfPlatformConfig = {
    app_icon: string;
    app_title: string;
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
export const mf_platform_config: MfPlatformConfig[] = [
    {
        app_icon: getPlatformSettingsAppstore('trader').icon,
        app_title: getPlatformSettingsAppstore('trader').name,
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('Multipliers trading platform.'),
        link_to: routes.trade,
    },
];
