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

const BinaryRoutes = (props: TBinaryRoutesProps) => {
    const { is_p2p_v2_enabled } = useFeatureFlags();
    const [routesConfig, setRoutesConfig] = React.useState(getRoutesConfig());
    useEffect(() => {
        if (is_p2p_v2_enabled) {
            const routes_replicate = [...routesConfig];
            routes_replicate[0].routes?.push({
                path: routes.cashier_p2p_v2,
                getTitle: () => localize('Deriv P2P-V2'),
                icon_component: 'IcDp2p',
            });
            setRoutesConfig(routes_replicate);
        }
    }, [is_p2p_v2_enabled]);

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
