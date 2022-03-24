import React from 'react';
import { makeLazyLoader, componentLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => componentLoader(() => import(/* webpackChunkName: "cashier-app", webpackPreload: true */ './App.jsx')),
    () => <Loading />
)();

export default App;
