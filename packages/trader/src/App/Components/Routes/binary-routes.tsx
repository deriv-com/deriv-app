import React from 'react';
import { Switch } from 'react-router-dom';
import getRoutesConfig from 'App/Constants/routes-config';
import { TBinaryRoutesProps, TRouteConfig } from 'Types';
import RouteWithSubRoutes from './route-with-sub-routes';

const BinaryRoutes = (props: TBinaryRoutesProps) => (
    <React.Suspense fallback={<div />}>
        <Switch>
            {getRoutesConfig().map((route: TRouteConfig) => (
                <RouteWithSubRoutes key={route.getTitle?.()} {...route} {...props} />
            ))}
        </Switch>
    </React.Suspense>
);

export default BinaryRoutes;
