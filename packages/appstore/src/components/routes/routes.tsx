import * as React from 'react';
import { Localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import { useStores } from 'Stores';
import { TRoute } from 'Types';
import { observer } from 'mobx-react-lite';
import { Switch } from 'react-router-dom';
import RouteWithSubroutes from './route-with-sub-routes.jsx';

const Routes: React.FC = observer(() => {
    const { config } = useStores();

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
                    return <RouteWithSubroutes key={idx} {...route} />;
                })}
            </Switch>
        </React.Suspense>
    );
});

export default Routes;
