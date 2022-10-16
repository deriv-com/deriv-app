import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "cfd-app", webpackPreload: true */ './app'),
    () => <Loading />
)();

export default App;
