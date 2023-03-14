import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "cashier-app", webpackPreload: true */ './app')),
    () => <Loading />
)();

export default App;
