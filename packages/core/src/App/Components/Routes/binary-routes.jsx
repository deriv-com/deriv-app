import React from 'react';
import { Switch, Prompt, useLocation } from 'react-router-dom';
import { Loading } from '@deriv/components';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';
import { observer, useStore } from '@deriv/stores';
import { getPositionsV2TabIndexFromURL, routes } from '@deriv/shared';
import { useDtraderV2Flag } from '@deriv/hooks';

const BinaryRoutes = observer(props => {
    const { ui, gtm } = useStore();
    const { promptFn, prompt_when } = ui;
    const { pushDataLayer } = gtm;
    const location = useLocation();
    const { dtrader_v2_enabled } = useDtraderV2Flag();

    React.useEffect(() => {
        pushDataLayer({ event: 'page_load' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const getLoader = () => {
        if (dtrader_v2_enabled)
            return (
                <Loading.DTraderV2
                    initial_app_loading
                    is_contract_details={location.pathname.startsWith('/contract/')}
                    is_positions={location.pathname === routes.trader_positions}
                    is_closed_tab={getPositionsV2TabIndexFromURL() === 1}
                />
            );
        return <Loading />;
    };

    return (
        <React.Suspense fallback={getLoader()}>
            <Prompt when={prompt_when} message={promptFn} />
            <Switch>
                {getRoutesConfig().map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
});

export default BinaryRoutes;
