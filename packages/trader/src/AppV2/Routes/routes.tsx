import { lazy } from 'react';
import { RouteProps } from 'react-router';
import { routes } from '@deriv/shared';
import Trade from 'AppV2/Containers/Trade';
import Markets from 'AppV2/Containers/Markets';
import Positions from 'AppV2/Containers/Positions';
import Menu from 'AppV2/Containers/Menu';

const traderRoutes: RouteProps[] = [
    {
        path: routes.trade,
        component: Trade,
        exact: true,
    },
    {
        path: routes.markets,
        component: Markets,
    },
    {
        path: routes.trader_positions,
        component: Positions,
    },
    {
        path: routes.trader_menu,
        component: Menu,
    },
    {
        // default route
        component: lazy(() => import('Modules/Page404')),
    },
];

export default traderRoutes;
