import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv-app/shared';
import { Loading } from '@deriv-app/components';

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "appstore", webpackPreload: true */ './components/app')),
    () => <Loading />
)();

export default App;
