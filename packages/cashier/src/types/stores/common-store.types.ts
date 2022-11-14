import { RouteComponentProps } from 'react-router';

type TCommonStoreError = {
    header: string | JSX.Element;
    message: string | JSX.Element;
    type?: string;
    redirect_label: string;
    redirect_to: string;
    should_clear_error_on_click: boolean;
    should_show_refresh: boolean;
    redirectOnClick: () => void;
    setError: (has_error: boolean, error: TCommonStoreError | null) => void;
};

export type TCommonStore = {
    error: TCommonStoreError;
    is_from_derivgo: boolean;
    has_error: boolean;
    platform: string;
    routeBackInApp: (history: Pick<RouteComponentProps, 'history'>, additional_platform_path?: string[]) => void;
    routeTo: (pathname: string) => void;
};
