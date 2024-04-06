import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "p2p-app", webpackPreload: true */ './app')),
    () => <Loading is_fullscreen={false} />
)();

export default App;
