import { getStaticUrl, CFD_PLATFORMS, getUrlSmartTrader, getUrlBinaryBot } from '@deriv/shared';
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
    is_eu_user: boolean,
    name: string,
    is_deriv_platform: boolean
) => {
    return () => {
        if (is_deriv_platform) {
            switch (name) {
                case DERIV_PLATFORM_NAMES.TRADER:
                    window.open(getStaticUrl(`/dtrader`));
                    break;
                case DERIV_PLATFORM_NAMES.DBOT:
                    window.open(getStaticUrl(`/dbot`));
                    break;
                case DERIV_PLATFORM_NAMES.SMARTTRADER:
                    window.open(getUrlSmartTrader());
                    break;
                case DERIV_PLATFORM_NAMES.BBOT:
                    window.open(getUrlBinaryBot());
                    break;
                case DERIV_PLATFORM_NAMES.GO:
                    window.open(getStaticUrl('/deriv-go'));
                    break;
                default:
            }
        }
        if (platform === CFD_PLATFORMS.MT5 && availability === 'EU')
            window.open(getStaticUrl(`/dmt5`, {}, false, true));
        else if (platform === CFD_PLATFORMS.MT5 && availability !== 'EU') window.open(getStaticUrl(`/dmt5`));
        else if (platform === CFD_PLATFORMS.DXTRADE) window.open(getStaticUrl(`/derivx`));
        else if (platform === CFD_PLATFORMS.DERIVEZ) window.open(getStaticUrl(`/derivez`));
        else if (icon === 'Options' && !is_eu_user) window.open(getStaticUrl(`/trade-types/options/`));
        else;
    };
};

// The platform names were taken from packages/shared/brand.config.json
export const DERIV_PLATFORM_NAMES = {
    TRADER: 'Deriv Trader',
    DBOT: 'Deriv Bot',
    SMARTTRADER: 'SmartTrader',
    BBOT: 'Binary Bot',
    GO: 'Deriv GO',
} as const;
