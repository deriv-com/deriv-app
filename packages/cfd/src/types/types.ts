import { Jurisdiction } from '@deriv/shared';
import type { TCoreStores } from '@deriv/stores/types';
import { Redirect, RouteProps } from 'react-router-dom';
import { TPage404 } from '../Constants/routes-config';

export type TTradingPlatformAvailableAccount = TCoreStores['client']['trading_platform_available_accounts'][number];

export type TJurisdiction = typeof Jurisdiction[keyof typeof Jurisdiction];

export type TRoute = {
    exact?: boolean;
    id?: string;
    icon_component?: string;
    is_invisible?: boolean;
    path?: string;
    icon?: string;
    default?: boolean;
    to?: string;
    component?: ((props?: RouteProps['component']) => JSX.Element) | Partial<typeof Redirect> | TPage404;
    getTitle?: () => string;
    is_disabled?: boolean;
    is_hidden?: boolean;
    subroutes?: TRoute[];
};

export type TRouteConfig = TRoute & {
    is_modal?: boolean;
    is_authenticated?: boolean;
    routes?: TRoute[];
};

export type TBinaryRoutes = {
    is_logged_in: boolean;
    is_logging_in: boolean;
    passthrough?: {
        root_store: TCoreStores;
        WS: Record<string, unknown>;
    };
};
