import React from 'react';
import { makeLazyLoader } from '@deriv-app/shared';
import { Loading } from '@deriv-app/components';
import 'promise-polyfill';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "reports-app", webpackPreload: true */ './app'),
    () => <Loading />
)();

export default App;
