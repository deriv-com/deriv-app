import React, { useEffect } from 'react';
import { Switch } from 'react-router-dom';
import { Localize, localize } from '@deriv/translations';
import getRoutesConfig from 'Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes';
import { useFeatureFlags } from '@deriv/hooks';
import { routes } from '@deriv/shared';

type TBinaryRoutesProps = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

const Loading = () => {
    return (
        <div>
            <Localize i18n_default_text='Loading...' />
        </div>
    );
};

const cashierV2RoutesConfig = {
    p2p_v2: {
        path: routes.cashier_p2p_v2,
        getTitle: () => localize('Deriv P2P-V2'),
        icon_component: 'IcDp2p',
    },
    cashier_v2: {
        path: routes.cashier_v2,
        getTitle: () => localize('Deriv Cashier-V2'),
        icon_component: 'IcCashier',
    },
} as const;

const BinaryRoutes = (props: TBinaryRoutesProps) => {
    const { is_p2p_v2_enabled, is_next_cashier_enabled } = useFeatureFlags();
    const [routesConfig, setRoutesConfig] = React.useState(getRoutesConfig());

    useEffect(() => {
        const isRouteAdded = (routePath: string) => routesConfig[0].routes?.some(route => route.path === routePath);

        const should_add_p2p_v2_route = is_p2p_v2_enabled && !isRouteAdded(routes.cashier_p2p_v2);
        const should_add_cashier_v2_route = is_next_cashier_enabled && !isRouteAdded(routes.cashier_v2);

        if (should_add_p2p_v2_route || should_add_cashier_v2_route) {
            const routes_replicate = [...routesConfig];

            should_add_p2p_v2_route && routes_replicate[0].routes?.push(cashierV2RoutesConfig.p2p_v2);
            should_add_cashier_v2_route && routes_replicate[0].routes?.push(cashierV2RoutesConfig.cashier_v2);

            setRoutesConfig(routes_replicate);
        }
    }, [is_next_cashier_enabled, is_p2p_v2_enabled, routesConfig]);

    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                {routesConfig.map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default BinaryRoutes;
