import React from 'react';
import { makeLazyLoader, moduleLoader } from './utils/loader';

const LazyApp = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "cashier-v2", webpackPreload: true */ './App')),
    () => <div />
)();

export default LazyApp;
