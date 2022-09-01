type TError = {
    header: string;
    message: string;
    type: string;
    redirect_label: string;
    redirect_to: string;
    should_clear_error_on_click: boolean;
    should_show_refresh: boolean;
    redirectOnClick: () => void;
    setError: (has_error: boolean, error: TError) => void;
};

export type TCommonStore = {
    error: TError;
    has_error: boolean;
    platform: string;
    routeTo: (pathname: string) => void;
};
