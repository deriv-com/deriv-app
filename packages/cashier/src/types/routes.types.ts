import React from 'react';

export type TRoute = {
    default?: boolean;
    exact?: boolean;
    id?: string;
    icon_component: string;
    is_invisible?: boolean;
    path?: string;
    to?: string;
    component?: typeof React.Component;
    getTitle: () => string;
    routes?: TRoute[];
};

export type TRouteConfig = TRoute & {
    is_modal?: boolean;
    is_authenticated?: boolean;
    routes?: TRoute[];
};
