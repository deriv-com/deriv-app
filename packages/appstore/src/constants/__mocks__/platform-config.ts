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
