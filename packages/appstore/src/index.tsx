import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv-lib/shared';
import { Loading } from '@deriv-lib/components';

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "appstore", webpackPreload: true */ './components/app')),
    () => <Loading />
)();

export default App;
