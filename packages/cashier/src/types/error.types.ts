import { TServerError } from './websocket.types';

// Type of the instance of the ErrorStore
export type TError = {
    code?: string;
    fields: string[] | string;
    is_ask_authentication: boolean;
    is_ask_financial_risk_approval: boolean;
    is_self_exclusion_max_turnover_set: boolean;
    is_show_full_page: boolean;
    message?: string;
    onClickButton: VoidFunction | null;
    setErrorMessage: (error: TServerError, onClickButton: TError['onClickButton'], is_show_full_page: boolean) => void;
};
