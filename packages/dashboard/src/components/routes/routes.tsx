import * as React from 'react';
import { Switch } from 'react-router-dom';
import { RouteWithSubroutes } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import getRoutesConfig from 'Constants/routes-config';
import { useStores } from 'Stores';
import { TRoute } from 'Types';
import RoutesWrapper from './routes-wrapper';

const Routes: React.FC = () => {
    const { ui_store, config_store } = useStores();

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
            <RoutesWrapper has_router={config_store.has_router}>
                <Switch>
                    {getRoutesConfig({
                        consumer_routes: config_store.routes,
                        is_deriv_crypto: config_store.is_deriv_crypto,
                        Page404: ui_store.components.Page404,
                    }).map((route: TRoute, idx: number) => (
                        <RouteWithSubroutes
                            key={idx}
                            Component404={ui_store.components.Page404}
                            LoginPrompt={ui_store.components.LoginPrompt}
                            {...route}
                        />
                    ))}
                </Switch>
            </RoutesWrapper>
        </React.Suspense>
    );
};

export default observer(Routes);
