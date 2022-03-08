import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "appstore", webpackPreload: true */ './components/app'),
    () => <Loading />
)();

export default App;
