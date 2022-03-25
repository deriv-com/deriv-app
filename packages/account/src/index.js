import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "account-app", webpackPreload: true */ './App.jsx')),
    () => <Loading />
)();

export default App;
