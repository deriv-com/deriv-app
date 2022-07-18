import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "trader-app", webpackPreload: true */ './App/index')),
    () => <Loading />
)();

export default App;
