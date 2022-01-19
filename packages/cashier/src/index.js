import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader({
    importFn: () => import(/* webpackChunkName: "cashier-app", webpackPreload: true */ './App.jsx'),
    // eslint-disable-next-line react/display-name
    loaderFn: () => <Loading />,
    modulesFn: ['./App.jsx'],
    webpackFn: () => [require.resolveWeak('./App.jsx')],
})();

export default App;
