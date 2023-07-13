export type TPaymentMethodOrder = Partial<
    Record<'bank_transfer' | 'other' | 'wechat_pay' | 'alipay' | 'skrill' | 'paypal', number>
>;

export type TPaymentMethodField = {
    display_name: string;
    required: number;
    type: string;
    value?: string;
};

export type TPaymentMethod = {
    ID: string;
    name: string;
    is_enabled: number;
    method: keyof TPaymentMethodOrder;
    display_name: string;
    fields: {
        account: TPaymentMethodField;
        instructions: TPaymentMethodField;
    };
};

type TAvailability = 0 | 1;
type TAdvertiserDetails = {
    completed_orders_count: number;
    first_name?: string;
    id: string;
    is_online: TAvailability;
    last_name?: string;
    last_online_time: number | null;
    name: string;
    rating_average: null | number;
    rating_count: number;
    recommended_average: null | number;
    recommended_count: number | null;
    total_completion_rate: null | number;
};

export type TAdDetails = {
    row: {
        account_currency: string;
        active_orders: number;
        advertiser_details: TAdvertiserDetails;
        amount: number;
        amount_display: string;
        block_trade?: number;
        contact_info: string;
        counterparty_type: string;
        country: string;
        created_time: number;
        days_until_archive?: number;
        description: string;
        effective_rate: null | number;
        effective_rate_display: null | string;
        id: string;
        is_active: TAvailability;
        is_visible: TAvailability;
        local_currency: string;
        max_order_amount: number;
        max_order_amount_display: string;
        max_order_amount_limit: number;
        max_order_amount_limit_display: string;
        min_order_amount: number;
        min_order_amount_display: string;
        min_order_amount_limit: number;
        min_order_amount_limit_display: string;
        payment_info: string;
        payment_method: null | string;
        payment_method_names: null | string[];
        price: null | number;
        price_display: null | string;
        rate: number;
        rate_display: string;
        rate_type: string;
        remaining_amount: number;
        remaining_amount_display: string;
        type: string;
        visibility_status?: string;
    };
};
