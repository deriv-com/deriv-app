import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const Bot = makeLazyLoader(
    () => import(/* webpackChunkName: "bot-web-ui-app", webpackPreload: true */ './app.jsx'),
    () => <Loading />
)();

export default Bot;
