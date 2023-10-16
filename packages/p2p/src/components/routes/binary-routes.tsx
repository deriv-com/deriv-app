import React from 'react';
import { Switch } from 'react-router-dom';
import { TRoute } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import { TBinaryRoutes } from 'Types/routes.types';

const Loading = () => (
    <div>
        <Localize i18n_default_text='Loading...' />
    </div>
);

const LazyRouteWithSubRoutes = React.lazy(() => import('./route-with-sub-routes'));

const BinaryRoutes = (props: TBinaryRoutes) => {
    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                {getRoutesConfig().map((route: TRoute) => (
                    <LazyRouteWithSubRoutes key={route.path} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
