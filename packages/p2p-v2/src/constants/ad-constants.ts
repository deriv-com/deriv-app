export const COUNTERPARTIES_DROPDOWN_LIST = Object.freeze([
    { text: 'All', value: 'all' },
    { text: 'Blocked', value: 'blocked' },
]);

export const RATE_TYPE = Object.freeze({
    FIXED: 'fixed',
    FLOAT: 'float',
});

export const AD_ACTION = {
    ACTIVATE: 'activate',
    CREATE: 'create',
    DEACTIVATE: 'deactivate',
    DELETE: 'delete',
    EDIT: 'edit',
    SHARE: 'share',
} as const;

export const ADVERT_TYPE = Object.freeze({
    BUY: 'Buy',
    SELL: 'Sell',
});

export const SORT_BY_LIST = Object.freeze([
    { text: 'Exchange rate', value: 'rate' },
    { text: 'User rating', value: 'rating' },
]);

export const AD_CONDITION_TYPES = {
    COMPLETION_RATE: 'completionRates',
    JOINING_DATE: 'joiningDate',
    PREFERRED_COUNTRIES: 'preferredCountries',
} as const;

export const AD_CONDITION_CONTENT: Record<
    string,
    { description: string; options?: { label: string; value: number }[]; title: string }
> = {
    completionRates: {
        description:
            'We’ll only show your ad to people with a completion rate higher than your selection. \n\nThe completion rate is the percentage of successful orders.',
        options: [
            { label: '50%', value: 50 },
            { label: '70%', value: 70 },
            { label: '90%', value: 90 },
        ],
        title: 'Completion rate of more than',
    },
    joiningDate: {
        description:
            'We’ll only show your ad to people who’ve been using Deriv P2P for longer than the time you choose.',
        options: [
            { label: '15 days', value: 15 },
            { label: '30 days', value: 30 },
            { label: '60 days', value: 60 },
        ],
        title: 'Joined more than',
    },
    preferredCountries: {
        description: 'We’ll only show your ad to people in the countries you choose.',
        title: 'Preferred countries',
    },
} as const;

export const DUMMY_COUNTRIES = {
    ad: {
        country_name: 'Andorra',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'EUR',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    af: {
        country_name: 'Afghanistan',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'AFN',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    ag: {
        country_name: 'Antigua and Barbuda',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'XCD',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    ai: {
        country_name: 'Anguilla',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'XCD',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    al: {
        country_name: 'Albania',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'ALL',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    am: {
        country_name: 'Armenia',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'AMD',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    an: {
        country_name: 'Netherlands Antilles',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'ANG',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    ao: {
        country_name: 'Angola',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'AOA',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    aq: {
        country_name: 'Antarctica',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'AAD',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    ar: {
        country_name: 'Argentina',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'ARS',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    aw: {
        country_name: 'Aruba',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'AWG',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    ax: {
        country_name: 'Aland Islands',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'EUR',
        payment_methods: {},
    },
    az: {
        country_name: 'Azerbaijan',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'AZN',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    ba: {
        country_name: 'Bosnia and Herzegovina',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'BAM',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    bb: {
        country_name: 'Barbados',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'BBD',
        payment_methods: {},
    },
    bd: {
        country_name: 'Bangladesh',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'BDT',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    bf: {
        country_name: 'Burkina Faso',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'XOF',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
            exchange4free: {
                display_name: 'Exchange4free',
                fields: {
                    account: {
                        display_name: 'Exchange4free account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
            mobicash: {
                display_name: 'MobiCash',
                fields: {
                    account: {
                        display_name: 'MobiCash account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
            orange_money: {
                display_name: 'Orange Money',
                fields: {
                    account: {
                        display_name: 'Orange Money account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
            paxful: {
                display_name: 'Paxful',
                fields: {
                    account: {
                        display_name: 'Paxful account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
            sticpay: {
                display_name: 'SticPay',
                fields: {
                    account: {
                        display_name: 'SticPay account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
            yup_africa: {
                display_name: 'YUP Africa',
                fields: {
                    account: {
                        display_name: 'YUP Africa account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    bh: {
        country_name: 'Bahrain',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'BHD',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    bi: {
        country_name: 'Burundi',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'BIF',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    bj: {
        country_name: 'Benin',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'XOF',
        payment_methods: {
            bitpay: {
                display_name: 'BitPay',
                fields: {
                    account: {
                        display_name: 'BitPay account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
            boss_revolution: {
                display_name: 'Boss Revolution',
                fields: {
                    account: {
                        display_name: 'Boss Revolution account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
            mtn_momo: {
                display_name: 'MTN Mobile Money (MoMo)',
                fields: {
                    account: {
                        display_name: 'MTN Mobile Money (MoMo) account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
            transferwise: {
                display_name: 'TransferWise',
                fields: {
                    account: {
                        display_name: 'TransferWise account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
            xpress_money: {
                display_name: 'Xpress Money',
                fields: {
                    account: {
                        display_name: 'Xpress Money account',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    bl: {
        country_name: 'Saint-Barthélemy',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'EUR',
        payment_methods: {},
    },
    bm: {
        country_name: 'Bermuda',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'BMD',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    bn: {
        country_name: 'Brunei Darussalam',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'BND',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
    bo: {
        country_name: 'Bolivia',
        cross_border_ads_enabled: 1,
        fixed_rate_adverts: 'enabled',
        float_rate_adverts: 'disabled',
        float_rate_offset_limit: 10,
        local_currency: 'BOB',
        payment_methods: {
            alipay: {
                display_name: 'Alipay',
                fields: {
                    account: {
                        display_name: 'Alipay ID',
                        required: 1,
                        type: 'text',
                    },
                    instructions: {
                        display_name: 'Instructions',
                        required: 0,
                        type: 'memo',
                    },
                },
                type: 'ewallet',
            },
        },
    },
};
