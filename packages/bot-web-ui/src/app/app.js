import React from 'react';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const Bot = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "bot-web-ui-app", webpackPreload: true */ './app.tsx')),
    () => <Loading />
)();

export default Bot;
