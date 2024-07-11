import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv-lib/shared';
import { Loading } from '@deriv-lib/components';
import './index.scss';

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "p2p-app", webpackPreload: true */ './app')),
    () => <Loading className='p2p-app-loader' />
)();

export default App;
