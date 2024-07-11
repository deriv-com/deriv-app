import React from 'react';
import { makeLazyLoader } from '@deriv-lib/shared';
import { Loading } from '@deriv-lib/components';
import 'promise-polyfill';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "reports-app", webpackPreload: true */ './app'),
    () => <Loading />
)();

export default App;
