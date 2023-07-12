import React from 'react';
import { Loading } from '@deriv/components';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';

const Bot = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "bot-web-ui-app", webpackPreload: true */ './app.tsx')),
    () => <Loading />
)();

export default Bot;
