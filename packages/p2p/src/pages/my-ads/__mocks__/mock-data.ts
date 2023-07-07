export const adverts = [
    {
        account_currency: 'USD',
        active_orders: 0,
        advertiser_details: {
            completed_orders_count: 0,
            id: '34',
            is_online: 1,
            last_online_time: 1688480346,
            name: 'client CR90000212',
            rating_average: null,
            rating_count: 0,
            recommended_average: null,
            recommended_count: null,
            total_completion_rate: null,
        },
        amount: 22,
        amount_display: '22.00',
        block_trade: 0,
        contact_info: '',
        counterparty_type: 'sell',
        country: 'id',
        created_time: 1688460999,
        description: '',
        effective_rate: 22,
        effective_rate_display: '22.00',
        id: '138',
        is_active: 1,
        is_visible: 1,
        local_currency: 'IDR',
        max_order_amount: 22,
        max_order_amount_display: '22.00',
        max_order_amount_limit: 22,
        max_order_amount_limit_display: '22.00',
        min_order_amount: 22,
        min_order_amount_display: '22.00',
        min_order_amount_limit: 22,
        min_order_amount_limit_display: '22.00',
        payment_info: '',
        payment_method: null,
        payment_method_names: ['Bank Transfer'],
        price: 22,
        price_display: '22.00',
        rate: 22,
        rate_display: '22.00',
        rate_type: 'fixed',
        remaining_amount: 22,
        remaining_amount_display: '22.00',
        type: 'buy',
    },
];

export const available_payment_methods = {
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
    bank_transfer: {
        display_name: 'Bank Transfer',
        fields: {
            account: {
                display_name: 'Account Number',
                required: 1,
                type: 'text',
            },
            bank_code: {
                display_name: 'SWIFT or IFSC code',
                required: 0,
                type: 'text',
            },
            bank_name: {
                display_name: 'Bank Name',
                required: 1,
                type: 'text',
            },
            branch: {
                display_name: 'Branch',
                required: 0,
                type: 'text',
            },
            instructions: {
                display_name: 'Instructions',
                required: 0,
                type: 'memo',
            },
        },
        type: 'bank',
    },
    other: {
        display_name: 'Other',
        fields: {
            account: {
                display_name: 'Account ID / phone number / email',
                required: 0,
                type: 'text',
            },
            instructions: {
                display_name: 'Instructions',
                required: 0,
                type: 'memo',
            },
            name: {
                display_name: 'Payment method name',
                required: 1,
                type: 'text',
            },
        },
        type: 'other',
    },
    paypal: {
        display_name: 'PayPal',
        fields: {
            account: {
                display_name: 'Email or phone number',
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
    skrill: {
        display_name: 'Skrill',
        fields: {
            account: {
                display_name: 'Email or phone number',
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
    wechat_pay: {
        display_name: 'WeChat Pay',
        fields: {
            account: {
                display_name: 'Phone number',
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
};

export const advertiser_payment_methods_list = [
    {
        ID: '43',
        is_enabled: 1,
        fields: {
            account: {
                display_name: 'Account Number',
                required: 1,
                type: 'text',
                value: 'e',
            },
            bank_code: {
                display_name: 'SWIFT or IFSC code',
                required: 0,
                type: 'text',
                value: 'e',
            },
            bank_name: {
                display_name: 'Bank Name',
                required: 1,
                type: 'text',
                value: 'r',
            },
            branch: {
                display_name: 'Branch',
                required: 0,
                type: 'text',
                value: 'r',
            },
            instructions: {
                display_name: 'Instructions',
                required: 0,
                type: 'memo',
                value: 'r',
            },
        },
        method: 'bank_transfer',
        display_name: 'Bank Transfer',
    },
    {
        ID: '44',
        is_enabled: 1,
        fields: {
            account: {
                display_name: 'Phone number',
                required: 1,
                type: 'text',
                value: 'd',
            },
            instructions: {
                display_name: 'Instructions',
                required: 0,
                type: 'memo',
                value: 'r',
            },
        },
        method: 'wechat_pay',
        display_name: 'WeChat Pay',
    },
    {
        ID: '45',
        is_enabled: 1,
        fields: {
            account: {
                display_name: 'Alipay ID',
                required: 1,
                type: 'text',
                value: 'h',
            },
            instructions: {
                display_name: 'Instructions',
                required: 0,
                type: 'memo',
                value: 'h',
            },
        },
        method: 'alipay',
        display_name: 'Alipay',
    },
    {
        ID: '47',
        is_enabled: 1,
        fields: {
            account: {
                display_name: 'Email or phone number',
                required: 1,
                type: 'text',
                value: 'f',
            },
            instructions: {
                display_name: 'Instructions',
                required: 0,
                type: 'memo',
                value: 'f',
            },
        },
        method: 'paypal',
        display_name: 'PayPal',
    },
];
