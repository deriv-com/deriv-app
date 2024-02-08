export const COUNTERPARTIES_DROPDOWN_LIST = [
    { value: 'all', text: 'All' },
    { value: 'blocked', text: 'Blocked' },
];

export const RATE_TYPE = {
    FLOAT: 'float',
    FIXED: 'fixed',
};

export const AD_ACTION = {
    EDIT: 'edit',
    CREATE: 'create',
    ACTIVATE: 'activate',
    DEACTIVATE: 'deactivate',
    DELETE: 'delete',
};

export const ADVERT_TYPE = {
    SELL: 'Sell',
    BUY: 'Buy',
};

export const ERROR_CODES = {
    AD_EXCEEDS_BALANCE: 'advertiser_balance',
    AD_EXCEEDS_DAILY_LIMIT: 'advertiser_daily_limit',
    ADVERT_INACTIVE: 'advert_inactive',
    ADVERT_MAX_LIMIT: 'advert_max_limit',
    ADVERT_MIN_LIMIT: 'advert_min_limit',
    ADVERT_REMAINING: 'advert_remaining',
    ADVERTISER_ADS_PAUSED: 'advertiser_ads_paused',
    ADVERTISER_TEMP_BAN: 'advertiser_temp_ban',
};
