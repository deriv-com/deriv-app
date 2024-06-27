import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () =>
        moduleLoader(() => {
            let is_dtrader_v2;
            try {
                is_dtrader_v2 = JSON.parse(localStorage.getItem('FeatureFlagsStore') ?? '').data.dtrader_v2;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('FeatureFlagsStore does not exist in local storage:', error);
                is_dtrader_v2 = null;
            }
            const is_mobile = window.innerWidth < 600;

            if (is_dtrader_v2 && is_mobile) {
                return import(/* webpackChunkName: "trader-app-v2", webpackPreload: true */ './AppV2/index');
            }
            return import(/* webpackChunkName: "trader-app", webpackPreload: true */ './App/index');
        }),
    () => {
        const getLoader = () => {
            const should_show_dtrader_v2_loader =
                JSON.parse(localStorage.getItem('FeatureFlagsStore') ?? '').data.dtrader_v2 && window.innerWidth < 600;
            if (should_show_dtrader_v2_loader) return <Loading.DTraderV2 />;
            return <Loading />;
        };
        return getLoader();
    }
)();

export default App;
