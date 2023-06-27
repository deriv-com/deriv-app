import { TServerError } from './websocket.types';

// Type of the instance of the ErrorStore
export type TError = TServerError & {
    is_ask_authentication?: boolean;
    is_ask_financial_risk_approval?: boolean;
    is_ask_uk_funds_protection?: boolean;
    is_self_exclusion_max_turnover_set?: boolean;
    is_show_full_page?: boolean;
    onClickButton?: VoidFunction | null;
    setErrorMessage?: (error: TServerError, onClickButton: TError['onClickButton'], is_show_full_page: boolean) => void;
};
