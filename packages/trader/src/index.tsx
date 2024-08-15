import React from 'react';
import { getPositionsV2TabIndexFromURL, isDTraderV2, makeLazyLoader, moduleLoader, routes } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () =>
        moduleLoader(() => {
            if (isDTraderV2()) {
                return import(/* webpackChunkName: "trader-app-v2", webpackPreload: true */ './AppV2/index');
            }
            return import(/* webpackChunkName: "trader-app", webpackPreload: true */ './App/index');
        }),
    () => {
        if (isDTraderV2())
            return (
                <Loading.DTraderV2
                    initial_app_loading
                    is_contract_details={window.location.pathname.startsWith('/contract/')}
                    is_positions={window.location.pathname === routes.trader_positions}
                    is_closed_tab={getPositionsV2TabIndexFromURL() === 1}
                />
            );
        return <Loading />;
    }
)();

export default App;
