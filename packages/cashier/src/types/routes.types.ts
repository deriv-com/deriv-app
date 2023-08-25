import React from 'react';

export type TRoute = {
    default?: boolean;
    exact?: boolean;
    id?: string;
    icon_component: string;
    is_invisible?: boolean;
    path?: string;
    to?: string;
    component?: React.FC<any>; // Using `any` as the prop type of the component since at this point we don't know what the component is.
    getTitle: () => string;
    routes?: TRoute[];
};

export type TRouteConfig = TRoute & {
    is_modal?: boolean;
    is_authenticated?: boolean;
    routes?: TRoute[];
};
