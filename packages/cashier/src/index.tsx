import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "cashier-app", webpackPreload: true */ './app.jsx'),
    () => <Loading />
)();

export default App;
