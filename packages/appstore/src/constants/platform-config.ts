import { getUrlSmartTrader, getUrlBot, getPlatformSettingsAppstore, routes, getStaticUrl } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { PlatformIcons } from 'Assets/svgs/trading-platform';
import { TAccountCategory, TRegionAvailability } from 'Types';

export type AccountType = { text: 'Real' | 'Demo'; value: TAccountCategory };
export type RegionAvailability = 'Non-EU' | 'EU' | 'All';
export const getAccountTypes = (): AccountType[] => [
    { text: localize('Demo'), value: 'demo' },
    { text: localize('Real'), value: 'real' },
];
export const region_availability: RegionAvailability[] = ['Non-EU', 'EU'];

export type BrandConfig = {
    name: string;
    icon: keyof typeof PlatformIcons;
    availability: TRegionAvailability;
    is_deriv_platform?: boolean;
};

export interface PlatformConfig {
    name: string;
    app_desc: string;
    link_to?: string;
    is_external?: boolean;
    new_tab?: boolean;
}

export interface MfPlatformConfig extends PlatformConfig {
    app_icon: string;
    app_title: string;
}

/**
 * Appends current URL search parameters to a given URL
 * @param url - The base URL to append parameters to
 * @returns The URL with search parameters appended
 */
export const appendSearchParamsToUrl = (url: string): string => {
    const search_params = new URLSearchParams(window.location.search);
    if (!search_params.toString()) return url;

    const url_obj = new URL(url, window.location.origin);
    const existing_params = url_obj.searchParams;

    search_params.forEach((value, key) => {
        existing_params.set(key, value);
    });

    url_obj.search = existing_params.toString();

    return url.startsWith('http') ? url_obj.toString() : `${url_obj.pathname}${url_obj.search}`;
};

export const getAppstorePlatforms = (): PlatformConfig[] => [
    {
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('The options and multipliers trading platform.'),
        link_to: routes.trade,
    },
    {
        name: getPlatformSettingsAppstore('dbot').name,
        app_desc: localize('The ultimate bot trading platform.'),
        link_to: appendSearchParamsToUrl(getUrlBot()),
        is_external: true,
    },
    {
        name: getPlatformSettingsAppstore('smarttrader').name,
        app_desc: localize('The legacy options trading platform.'),
        link_to: appendSearchParamsToUrl(getUrlSmartTrader()),
        is_external: true,
    },
    {
        name: getPlatformSettingsAppstore('go').name,
        app_desc: localize('The mobile app for trading multipliers and accumulators.'),
        link_to: getStaticUrl('/deriv-go'),
        is_external: true,
        new_tab: true,
    },
];

export const getMFAppstorePlatforms = (): MfPlatformConfig[] => [
    {
        app_icon: getPlatformSettingsAppstore('trader').icon,
        app_title: getPlatformSettingsAppstore('trader').name,
        name: getPlatformSettingsAppstore('trader').name,
        app_desc: localize('The multipliers trading platform.'),
        link_to: routes.trade,
    },
];

// The platform names were taken from packages/shared/brand.config.json
export const DERIV_PLATFORM_NAMES = {
    TRADER: 'Deriv Trader',
    DBOT: 'Deriv Bot',
    SMARTTRADER: 'SmartTrader',
    GO: 'Deriv GO',
} as const;
