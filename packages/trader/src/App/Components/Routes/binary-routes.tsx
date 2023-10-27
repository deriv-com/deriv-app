import React from 'react';
import { Switch } from 'react-router-dom';
import getRoutesConfig from 'App/Constants/routes-config';
import { TBinaryRoutesProps, TRouteConfig } from 'Types';
import RouteWithSubRoutes from './route-with-sub-routes';

const BinaryRoutes = (props: TBinaryRoutesProps) => (
    <React.Suspense fallback={<div />}>
        <Switch>
            {getRoutesConfig().map((route: TRouteConfig, index) => (
                /* Index is the only thing that can be used for the key here because the only other property
                that can be used as a key and available in every route is a localized title returned from getTitle() which,
                when used, causes severe bugs upon switching between languages! */
                <RouteWithSubRoutes key={index} {...route} {...props} />
            ))}
        </Switch>
    </React.Suspense>
);

export default BinaryRoutes;
