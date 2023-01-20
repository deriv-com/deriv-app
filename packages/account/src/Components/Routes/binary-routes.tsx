import React from 'react';
import { Switch } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes';
import { TBinaryRoutes, TPlatformContext, TRoute } from 'Types';

const BinaryRoutes = (props: TBinaryRoutes) => {
    const { is_appstore, is_pre_appstore } = React.useContext<TPlatformContext>(PlatformContext);

    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig({ is_appstore, is_pre_appstore }).map((route: TRoute, idx: number) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
