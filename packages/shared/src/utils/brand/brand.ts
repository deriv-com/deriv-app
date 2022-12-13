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
    icon?: string;
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

export const getLegalEntityName = (landing_company: keyof TLandingCompany) => {
    return config_data.legal_entities[landing_company];
};

export const getBrandWebsiteName = () => {
    return config_data.domain_name;
};

export const getPlatformSettings = (platform_key: keyof TPlatforms): TPlatform => {
    return config_data.platforms[platform_key];
};
