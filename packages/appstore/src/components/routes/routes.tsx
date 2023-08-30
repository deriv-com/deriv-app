import * as React from 'react';
import { useFeatureFlags } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import Wallets from '@deriv/wallets';
import getRoutesConfig from 'Constants/routes-config';
import { useStores } from 'Stores';
import { TRoute } from 'Types';
import { observer } from 'mobx-react-lite';
import { Switch } from 'react-router-dom';
import RouteWithSubroutes from './route-with-sub-routes.jsx';

const Routes: React.FC = observer(() => {
    const { config } = useStores();
    const { is_next_wallet_enabled } = useFeatureFlags();

    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig({
                    consumer_routes: config.routes,
                }).map((route: TRoute, idx: number) => {
                    // Temporary way to intercept the route to show the Wallets component.
                    let updated_route = route;
                    if (updated_route.path === '/appstore/traders-hub') {
                        updated_route = {
                            ...updated_route,
                            component: is_next_wallet_enabled ? Wallets : updated_route.component,
                        };
                    }

                    return <RouteWithSubroutes key={idx} {...updated_route} />;
                })}
            </Switch>
        </React.Suspense>
    );
});

export default Routes;
