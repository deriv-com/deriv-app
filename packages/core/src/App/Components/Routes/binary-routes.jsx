import React from 'react';
import { Switch, Prompt, useLocation } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';
import { observer, useStore } from '@deriv/stores';

const BinaryRoutes = observer(props => {
    const { ui, gtm, client } = useStore();
    const { promptFn, prompt_when } = ui;
    const { pushDataLayer } = gtm;
    const { is_eu } = client;
    const location = useLocation();
    const { is_appstore } = React.useContext(PlatformContext);
    React.useEffect(() => {
        pushDataLayer({ event: 'page_load' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const is_eu_country = is_eu;

    return (
        <React.Suspense fallback={<Loading />}>
            <Prompt when={prompt_when} message={promptFn} />
            <Switch>
                {getRoutesConfig({ is_appstore, is_eu_country }).map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
});

export default BinaryRoutes;
