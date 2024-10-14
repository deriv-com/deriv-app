import React from 'react';
import {
    getPositionsV2TabIndexFromURL,
    isDTraderV2,
    isDTraderV2Width,
    makeLazyLoader,
    moduleLoader,
    routes,
} from '@deriv/shared';
import { Loading } from '@deriv/components';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { TCoreStores } from '@deriv/stores/types';
import { TWebSocket } from 'Types';
import { Analytics } from '@deriv-com/analytics';

type Apptypes = {
    passthrough: {
        root_store: TCoreStores;
        WS: TWebSocket;
    };
};

const AppLoader = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "trader-app", webpackPreload: true */ './App/index')),
    () => <Loading />
)() as React.ComponentType<Apptypes>;

const AppV2Loader = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "trader-app-v2", webpackPreload: true */ './AppV2/index')),
    () => (
        <Loading.DTraderV2
            initial_app_loading
            is_contract_details={window.location.pathname.startsWith('/contract/')}
            is_positions={window.location.pathname === routes.trader_positions}
            is_closed_tab={getPositionsV2TabIndexFromURL() === 1}
        />
    )
)() as React.ComponentType<Apptypes>;

const App = ({ passthrough }: Apptypes) => {
    const [dtrader_v2_enabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'dtrader_v2_enabled',
    });
    const [dtrader_v2_enabled_gb, setDTraderV2EnabledGb] = React.useState(false);

    React.useEffect(() => {
        setDTraderV2EnabledGb(Boolean(dtrader_v2_enabled));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dtrader_v2_enabled, Analytics?.getInstances?.().ab?.GrowthBook.getFeatures()]);

    if (Analytics?.getInstances?.().ab?.GrowthBook.getFeatures()) {
        return isDTraderV2() || (dtrader_v2_enabled_gb && isDTraderV2Width()) ? (
            <AppV2Loader passthrough={passthrough} />
        ) : (
            <AppLoader passthrough={passthrough} />
        );
    }
    return <Loading />;
};
export default App;
