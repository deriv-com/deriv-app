import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import { TBinaryRoutes, TRoute } from 'Types';
import RouteWithSubRoutes from './route-with-sub-routes';

const BinaryRoutes = (props: TBinaryRoutes) => {
    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig().map((route: TRoute) => (
                    <RouteWithSubRoutes key={`${route.getTitle?.()}-${route.path}`} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
