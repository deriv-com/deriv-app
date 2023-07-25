import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes';

const Loading = () => (
    <div>
        <Localize i18n_default_text='Loading...' />
    </div>
);

const BinaryRoutes = props => {
    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                {getRoutesConfig().map(route => (
                    <RouteWithSubRoutes key={route.path} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
