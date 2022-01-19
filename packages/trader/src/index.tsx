// import 'babel-polyfill';
import 'promise-polyfill';

import 'event-source-polyfill';

import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader({
    importFn: () => import(/* webpackChunkName: "trader-app", webpackPreload: true */ './App/index'),
    loaderFn: () => <Loading />,
    modulesFn: ['./App/index'],
    webpackFn: () => [require.resolveWeak('./App/index')],
})();

export default App;
