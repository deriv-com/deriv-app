import { Redirect } from 'react-router-dom';
import { TPage404 } from '../constants/routes-config';

export type TRoute = {
    default?: boolean;
    exact?: boolean;
    id?: string;
    icon_component?: string;
    is_invisible?: boolean;
    path?: string;
    to?: string;
    component: ((cashier_routes?: TRoute[]) => JSX.Element) | TPage404 | typeof Redirect;
    getTitle: () => string;
};

export type TRouteConfig = TRoute & {
    is_modal?: boolean;
    is_authenticated?: boolean;
    routes?: TRoute[];
};
