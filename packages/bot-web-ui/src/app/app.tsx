import React from 'react';
import { Loading } from '@deriv-lib/components';
import { makeLazyLoader, moduleLoader } from '@deriv-lib/shared';

const Bot = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "bot-web-ui-app", webpackPreload: true */ './app-main')),
    () => <Loading />
)();

export default Bot;
