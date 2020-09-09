import React from 'react';
import { Switch } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';

const BinaryRoutes = (props) => {
    const platform_store = React.useContext(PlatformContext);

    return (
        <React.Suspense
            fallback={() => {
                return <div>LOADING...</div>;
            }}
        >
            <Switch>
                {getRoutesConfig({ is_deriv_crypto: platform_store.is_deriv_crypto }).map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
