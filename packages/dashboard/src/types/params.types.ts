export type TRoute = {
    component?: React.ReactNode;
    default?: boolean;
    exact?: boolean;
    getTitle?: () => string;
    icon?: string;
    is_authenticated?: boolean;
    is_routed?: boolean;
    label?: string;
    path?: string;
    subroutes?: TRoute[];
};

export type TRouteGroup = {
    default?: boolean;
    icon?: string;
    label?: string;
    path?: string;
    subitems?: number[];
}
