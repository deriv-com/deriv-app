export const ERROR_CODES = {
    AD_EXCEEDS_BALANCE: 'advertiser_balance',
    AD_EXCEEDS_DAILY_LIMIT: 'advertiser_daily_limit',
    ADVERT_INACTIVE: 'advert_inactive',
    ADVERT_MAX_LIMIT: 'advert_max_limit',
    ADVERT_MIN_LIMIT: 'advert_min_limit',
    ADVERT_REMAINING: 'advert_remaining',
    ADVERT_SAME_LIMITS: 'AdvertSameLimits',
    ADVERTISER_ADS_PAUSED: 'advertiser_ads_paused',
    ADVERTISER_NOT_FOUND: 'AdvertiserNotFound',
    ADVERTISER_TEMP_BAN: 'advertiser_temp_ban',
    DUPLICATE_ADVERT: 'DuplicateAdvert',
} as const;
