import config_data from '../../../brand.config.json';

type TLandingCompany = {
    fx: string;
    malta: string;
    maltainvest: string;
    mx: string;
    samoa: string;
    svg: string;
    v: string;
};

type TPlatform = {
    name: string;
    icon: string;
};

type TPlatformAppstore = {
    name: string;
    icon: string;
    availability: string;
};

type TPlatforms = {
    trader: TPlatform;
    dbot: TPlatform;
    mt5: TPlatform;
    dxtrade: TPlatform;
    derivez: TPlatform;
    smarttrader: TPlatform;
    bbot: TPlatform;
    go: TPlatform;
};

type TPlatformsAppstore = {
    trader: TPlatformAppstore;
    dbot: TPlatformAppstore;
    smarttrader: TPlatformAppstore;
    bbot: TPlatformAppstore;
    go: TPlatformAppstore;
};

const isDomainAllowed = (domain_name: string) => {
    // This regex will match any official deriv production and testing domain names.
    // Allowed deriv domains: binary.sx, binary.com, deriv.com, deriv.be, deriv.me and their subdomains.
    return /^(((.*)\.)?(binary\.(sx|com)|deriv.(com|me|be)))$/.test(domain_name);
};

export const getLegalEntityName = (landing_company: keyof TLandingCompany) => {
    return config_data.legal_entities[landing_company];
};

export const getBrandWebsiteName = () => {
    return config_data.domain_name;
};

export const getPlatformSettings = (platform_key: keyof TPlatforms): TPlatform => {
    const allowed_config_data = config_data.platforms[platform_key];

    if (!isDomainAllowed(window.location.host)) {
        // Remove all official platform logos if the app is hosted under unofficial domain
        allowed_config_data.icon = '';
    }

    return allowed_config_data;
};

export const getAppstorePlatforms = () => {
    const platform_data: Record<string, Record<string, string>> = config_data.platforms_appstore;
    return Object.keys(platform_data).map(key => platform_data[key]);
};

export const getPlatformSettingsAppstore = (platform_key: keyof TPlatformsAppstore): TPlatformAppstore => {
    return config_data.platforms_appstore[platform_key];
};
