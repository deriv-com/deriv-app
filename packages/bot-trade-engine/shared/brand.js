import config_data from './brand.config.json';

const isDomainAllowed = (domain_name) => {
    // This regex will match any official deriv production and testing domain names.
    // Allowed deriv domains: localhost, binary.sx, binary.com, deriv.com, deriv.be, deriv.me and their subdomains.
    return /^(((.*)\.)?(localhost:8443|pages.dev|binary\.(sx|com)|deriv.(com|me|be|dev)))$/.test(domain_name);
};

export const getLegalEntityName = (landing_company) => {
    return config_data.legal_entities[landing_company];
};

export const getBrandWebsiteName = () => {
    return config_data.domain_name;
};

export const getPlatformSettings = (platform_key) => {
    const allowed_config_data = config_data.platforms[platform_key];

    if (!isDomainAllowed(window.location.host)) {
        // Remove all official platform logos if the app is hosted under unofficial domain
        allowed_config_data.icon = '';
    }

    return allowed_config_data;
};

export const getAppstorePlatforms = () => {
    const platform_data = config_data.platforms_appstore;
    return Object.keys(platform_data).map(key => platform_data[key]);
};

export const getPlatformSettingsAppstore = (platform_key) => {
    return config_data.platforms_appstore[platform_key];
};
