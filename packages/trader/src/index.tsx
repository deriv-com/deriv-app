// import 'babel-polyfill';
import 'promise-polyfill';

import 'event-source-polyfill';

import React from 'react';
import { makeLazyLoader, componentLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => componentLoader(() => import(/* webpackChunkName: "trader-app", webpackPreload: true */ './App/index')),
    () => <Loading />
)();

export default App;
