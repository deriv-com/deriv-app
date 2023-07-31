import React from 'react';
import { Switch } from 'react-router-dom';
import { useStore } from '@deriv/stores';
import { PlatformContext } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import { TBinaryRoutes, TRoute } from 'Types';
import RouteWithSubRoutes from './route-with-sub-routes';

const BinaryRoutes = (props: TBinaryRoutes) => {
    const { common } = useStore();
    const { current_language } = common;
    const { is_appstore } = React.useContext(PlatformContext);

    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig({ is_appstore }).map((route: TRoute, idx: number) => (
                    <RouteWithSubRoutes key={`${idx}_${current_language}`} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
