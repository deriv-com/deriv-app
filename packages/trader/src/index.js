// import 'babel-polyfill';
import 'promise-polyfill';

import 'event-source-polyfill';

import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "trader-app", webpackPreload: true */ 'App/app.jsx'),
    () => <Loading />
)();

export default App;
