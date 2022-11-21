export type TRoute = {
    component?: any;
    default?: boolean;
    exact?: boolean;
    getTitle?: () => string;
    icon?: string;
    is_authenticated?: boolean;
    is_routed?: boolean;
    is_modal?: boolean;
    label?: string;
    path?: string;
    routes?: TRoute[];
    subroutes?: TRoute[];
    to?: string;
    is_logged_in?: boolean;
    is_logging_in?: boolean;
};

export type TRouteGroup = {
    default?: boolean;
    icon?: string;
    getTitle?: () => string;
    path?: string;
    subitems?: number[];
};
export type TRouteConfig = TRoute & {
    is_modal?: boolean;
    is_authenticated?: boolean;
    routes?: TRoute[];
};
