import 'promise-polyfill';

import 'event-source-polyfill';

import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "reports-app", webpackPreload: true */ './app.jsx'),
    () => <Loading />
)();

export default App;
