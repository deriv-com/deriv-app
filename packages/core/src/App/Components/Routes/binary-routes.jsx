import React from 'react';
import { Switch, Prompt, useLocation } from 'react-router-dom';
import { Loading } from '@deriv/components';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';
import { observer, useStore } from '@deriv/stores';
import { getPositionsV2TabIndexFromURL, isDTraderV2, isDTraderV2Width, routes } from '@deriv/shared';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';

const BinaryRoutes = observer(props => {
    const { ui, gtm } = useStore();
    const { promptFn, prompt_when } = ui;
    const { pushDataLayer } = gtm;
    const location = useLocation();
    const [dtrader_v2_enabled_gb] = useGrowthbookGetFeatureValue({
        featureFlag: 'dtrader_v2_enabled',
        defaultValue: false,
    });
    const [dtrader_v2_enabled, setDTraderV2Enabled] = React.useState(false);
    React.useEffect(() => {
        setDTraderV2Enabled(
            (isDTraderV2() || (Boolean(dtrader_v2_enabled_gb) && isDTraderV2Width())) &&
                (location.pathname.startsWith(routes.trade) || location.pathname.startsWith('/contract/'))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dtrader_v2_enabled_gb]);

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
