import React from 'react';
import { getPositionsV2TabIndexFromURL, makeLazyLoader, moduleLoader, routes } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { TCoreStores } from '@deriv/stores/types';
import { TWebSocket } from 'Types';
import { useDtraderV2Flag } from '@deriv/hooks';

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
    const { dtrader_v2_enabled, load_dtrader_module } = useDtraderV2Flag();
    if (load_dtrader_module) {
        return dtrader_v2_enabled ? <AppV2Loader passthrough={passthrough} /> : <AppLoader passthrough={passthrough} />;
    }
    return <Loading />;
};
export default App;
