import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv-app/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "account-app", webpackPreload: true */ './App')),
    () => <Loading />
)();

export default App;
