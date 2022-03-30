export type TRoute = {
    component?: React.ReactNode;
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
};

export type TRouteGroup = {
    default?: boolean;
    icon?: string;
    getTitle?: () => string;
    path?: string;
    subitems?: number[];
};
