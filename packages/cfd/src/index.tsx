import React from 'react';
import { makeLazyLoader } from '@deriv-app/shared';
import { Loading } from '@deriv-app/components';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "cfd-app", webpackPreload: true */ './app'),
    () => <Loading />
)();

export default App;
