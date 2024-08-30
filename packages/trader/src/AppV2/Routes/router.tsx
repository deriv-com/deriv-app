import React, { Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { UILoader, RouteWithSubroutes } from '@deriv/components';
import traderRoutes from './routes';
import { observer, useStore } from '@deriv/stores';
import Page404 from 'Modules/Page404';

const Router: React.FC = () => {
    const { client, common, portfolio } = useStore();
    const { is_logged_in } = client;
    const { current_language } = common;
    const { onMount, onUnmount } = portfolio;

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Suspense fallback={<UILoader />}>
            <Switch>
                {traderRoutes.map((route, index) => (
                    <RouteWithSubroutes
                        key={index}
                        is_logged_in={is_logged_in}
                        language={current_language}
                        Component404={Page404}
                        should_redirect_login
                        routes={traderRoutes}
                        to=''
                        {...route}
                    />
                ))}
            </Switch>
        </Suspense>
    );
};

export default observer(Router);
