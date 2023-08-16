import * as React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import RouteWithSubroutes from './route-with-sub-routes.jsx';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import getRoutesConfig from 'Constants/routes-config';
import { TRoute } from 'Types';

const Routes: React.FC = observer(() => {
    const { client } = useStore();
    const { is_logged_in, is_logging_in } = client;

    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig().map((route: TRoute, idx: number) => (
                    <RouteWithSubroutes
                        key={idx}
                        {...route}
                        is_logging_in={is_logging_in}
                        is_logged_in={is_logged_in}
                    />
                ))}
            </Switch>
        </React.Suspense>
    );
});

export default withRouter(Routes);
