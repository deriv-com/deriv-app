import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "trader-app", webpackPreload: true */ './App/index'),
    () => <Loading />
)();

export default App;
