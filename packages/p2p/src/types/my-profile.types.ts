export type TPaymentMethodFieldProps = {
    display_name: string;
    required: number;
    type: string;
    value?: string;
};

export type TPaymentMethodFieldMapProps = {
    0: string;
    1: TPaymentMethodFieldProps;
};

export type TPaymentMethod = {
    ID: string;
    display_name: string;
    fields: {
        account?: TPaymentMethodFieldProps;
        bank_name?: TPaymentMethodFieldProps;
        name?: TPaymentMethodFieldProps;
    };
    is_enabled: number;
    method: string;
};
