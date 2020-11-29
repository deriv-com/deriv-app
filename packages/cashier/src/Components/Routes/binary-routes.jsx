import React from 'react';
import { Switch } from 'react-router-dom';
import { Localize, PlatformContext } from '@deriv/shared';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';

const BinaryRoutes = props => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);

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
                {getRoutesConfig({ is_deriv_crypto }).map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
