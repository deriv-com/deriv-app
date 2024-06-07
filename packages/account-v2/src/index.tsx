import React, { Fragment } from 'react';
import { makeLazyLoader, moduleLoader } from './utils/loader';
import { ACCOUNT_MODAL_REF } from './constants';

const LazyApp = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "account-v2", webpackPreload: true */ './App')),
    () => <div />
)();

const App = () => (
    <Fragment>
        {/* This will be the used to bind modal in Accounts-v2 package*/}
        <div id={ACCOUNT_MODAL_REF.replace('#', '')} />
        <LazyApp />
    </Fragment>
);

export default App;
