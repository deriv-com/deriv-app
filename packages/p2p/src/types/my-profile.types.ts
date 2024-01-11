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
    display_name?: string;
    fields?: Partial<
        Record<'account' | 'bank_code' | 'bank_name' | 'branch' | 'instructions' | 'name', TPaymentMethodFieldProps>
    >;
    icon?: string;
    id?: string;
    is_enabled?: number;
    method?: string;
    type?: string;
    used_by_adverts?: string[] | null;
    used_by_orders?: string[] | null;
};

export type TPaymentMethodValues = {
    account?: string;
    bank_code?: string;
    bank_name?: string;
    branch?: string;
    instructions?: string;
    name?: string;
};
