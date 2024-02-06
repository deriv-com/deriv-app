import React from 'react';
import { makeLazyLoader, moduleLoader } from '@/utils/loader';

const LazyApp = makeLazyLoader(
    () => {
        return moduleLoader(() => import(/* webpackChunkName: "p2p-v2", webpackPreload: true */ './App'));
    },
    () => <div />
)();

export default LazyApp;
