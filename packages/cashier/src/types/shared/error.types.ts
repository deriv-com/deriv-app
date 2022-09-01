type TResponseError = {
    code?: string;
    message?: string;
};

export type TError = {
    code?: string;
    fields: string;
    is_ask_authentication: boolean;
    is_ask_financial_risk_approval: boolean;
    is_ask_uk_funds_protection: boolean;
    is_self_exclusion_max_turnover_set: boolean;
    is_show_full_page: boolean;
    message?: string;
    onClickButton: (() => void) | null;
    setErrorMessage: (
        error: TResponseError | string,
        onClickButton: TError['onClickButton'],
        is_show_full_page: boolean
    ) => void;
};
