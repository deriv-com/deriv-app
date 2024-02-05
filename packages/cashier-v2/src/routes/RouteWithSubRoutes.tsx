import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { TRouteTypes } from '../types';
import { defaultRoute } from './Router';

const RouteWithSubRoutes = ({
    component: RouteComponent,
    path: routePath,
    routes,
    title,
}: TRouteTypes.IRouteConfig) => {
    const location = useLocation();
    const pathname = location.pathname.replace(/\/$/, '');
    const isValidRoute = pathname === routePath || !!routes?.find(({ path }) => pathname === path);

    if (!isValidRoute) return <Redirect to='/404' />;

    return (
        <Route path={routePath}>
            {/* Redirection to default route "/cashier-v2/deposit" from "/cashier-v2" */}
            {pathname === routePath && <Redirect to={defaultRoute?.path} />}
            <RouteComponent path={routePath} routes={routes} title={title} />
        </Route>
    );
};

export default RouteWithSubRoutes;
