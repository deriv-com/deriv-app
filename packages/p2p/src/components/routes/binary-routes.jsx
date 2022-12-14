import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize } from 'Components/i18next';
import getRoutesConfig from '../../constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';

const BinaryRoutes = props => {
    return (
        <React.Suspense
            fallback={() => {
                return (
                    <div>
                        <Localize i18n_default_text='Loading...' />
                    </div>
                );
            }}
        >
            <Switch>
                {getRoutesConfig().map(route => (
                    <RouteWithSubRoutes key={route.path} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
