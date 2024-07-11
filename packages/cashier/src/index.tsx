import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv-lib/shared';
import { Loading } from '@deriv-lib/components';

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "cashier-app", webpackPreload: true */ './app')),
    () => <Loading />
)();

export default App;
