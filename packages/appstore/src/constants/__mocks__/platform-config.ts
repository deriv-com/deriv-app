import { getStaticUrl, CFD_PLATFORMS } from '@deriv/shared';
import { BrandConfig, RegionAvailability } from 'Constants/platform-config';

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

export const getAppstorePlatforms = (): PlatformConfig[] => [
    {
        name: 'Test Appstore Name',
        app_desc: 'getAppstorePlatforms description',
        link_to: 'getAppstorePlatforms.com',
    },
];

export const getMFAppstorePlatforms = (): MfPlatformConfig[] => [
    {
        app_icon: 'Test icon',
        app_title: 'Test title',
        name: 'Test Appstore Name',
        app_desc: 'getMFAppstorePlatforms description',
        link_to: 'getMFAppstorePlatforms.com',
    },
];

export const openStaticPage = (
    availability: RegionAvailability,
    platform: string | undefined,
    icon: BrandConfig['icon'],
    is_eu_user: boolean
) => {
    return () => {
        if (platform === CFD_PLATFORMS.MT5 && availability === 'EU')
            window.open(getStaticUrl(`/dmt5`, {}, false, true));
        else if (platform === CFD_PLATFORMS.MT5 && availability !== 'EU') window.open(getStaticUrl(`/dmt5`));
        else if (platform === CFD_PLATFORMS.DXTRADE) window.open(getStaticUrl(`/derivx`));
        else if (platform === CFD_PLATFORMS.DERIVEZ) window.open(getStaticUrl(`/derivez`));
        else if (icon === 'Options' && !is_eu_user) window.open(getStaticUrl(`/trade-types/options/`));
        else;
    };
};
