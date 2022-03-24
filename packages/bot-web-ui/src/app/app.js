import React from 'react';
import { makeLazyLoader, componentLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const Bot = makeLazyLoader(
    () => componentLoader(() => import(/* webpackChunkName: "bot-web-ui-app", webpackPreload: true */ './app.jsx')),
    () => <Loading />
)();

export default Bot;
