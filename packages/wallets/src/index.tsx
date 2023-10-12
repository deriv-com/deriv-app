import React from 'react';
import { makeLazyLoader, moduleLoader } from './utils/loader';

const LazyApp = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "wallets-app", webpackPreload: true */ './App')),
    () => <div />
)();

export default LazyApp;
