import config_data from '../../../brand.config.json';

export const getBrandName = () => {
    return config_data.brand_name;
};

export const getLegalEntityName = landing_company => {
    return config_data.legal_entities[landing_company];
};

export const getBrandWebsiteName = () => {
    return config_data.domain_name;
};

export const getPlatformSettings = platform_key => {
    return config_data.platforms[platform_key];
};

export const getPlatformSettingsAppstore = platform_key => {
    return config_data.platforms_appstore[platform_key];
};
