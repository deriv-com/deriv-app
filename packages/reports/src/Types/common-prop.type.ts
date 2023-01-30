import { Redirect } from 'react-router-dom';
import { TRootStore } from 'Stores/index';

export type TPassthrough = {
    root_store: TRootStore;
    WS: Record<string, any>;
};

export type TBinaryRoutes = {
    is_logged_in: boolean;
    is_logging_in: boolean;
    passthrough?: TPassthrough;
};

export type TRoute = {
    path?: string;
    component: React.ComponentType | typeof Redirect;
    is_authenticated?: boolean;
    getTitle: () => string;
    icon_component?: string;
    routes?: TRoute[];
    default?: boolean;
    to?: string;
    exact?: boolean;
};
