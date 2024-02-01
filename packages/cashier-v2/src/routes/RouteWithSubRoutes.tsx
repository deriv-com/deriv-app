import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { defaultRoute, IRouteConfig } from '../constants/routesConfig';

const RouteWithSubRoutes = (route: IRouteConfig) => {
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
