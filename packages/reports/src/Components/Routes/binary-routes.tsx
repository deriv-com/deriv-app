import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize } from '@deriv/translations';
import getRoutesConfig from '../../Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes';
import { TBinaryRoutes } from 'Types';

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
                {getRoutesConfig().map((route, idx) => (
                    <RouteWithSubRoutes key={route.path ?? idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
