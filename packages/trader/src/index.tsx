import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () =>
        moduleLoader(() => {
            const is_dtrader_v2 = JSON.parse(localStorage.getItem('FeatureFlagsStore') ?? '').data.dtrader_v2;
            const is_mobile = window.innerWidth < 600;

            if (is_dtrader_v2 && is_mobile) {
                return import(/* webpackChunkName: "trader-app-v2", webpackPreload: true */ './AppV2/index');
            }
            return import(/* webpackChunkName: "trader-app", webpackPreload: true */ './App/index');
        }),
    () => <Loading />
)();

export default App;
