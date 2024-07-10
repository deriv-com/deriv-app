import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv-app/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "appstore", webpackPreload: true */ './components/app')),
    () => <Loading />
)();

export default App;
