import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { TRouteTypes } from '../types';
import { defaultRoute } from './Router';

const RouteWithSubRoutes = (route: TRouteTypes.IRouteConfig) => {
    const location = useLocation();
    const pathname = location.pathname.replace(/\/$/, '');

    return (
        <Route path={route.path}>
            {/* Redirection to default route "/cashier-v2/deposit" from "/cashier-v2" */}
            {pathname === route.path && <Redirect to={defaultRoute?.path} />}
            <route.component {...route} />
        </Route>
    );
};

export default RouteWithSubRoutes;
