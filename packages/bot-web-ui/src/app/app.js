import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const Bot = makeLazyLoader({
    importFn: () => import(/* webpackChunkName: "bot-web-ui-app", webpackPreload: true */ './app.jsx'),
    // eslint-disable-next-line react/display-name
    loaderFn: () => <Loading />,
    modulesFn: ['./app.jsx'],
    webpackFn: () => [require.resolveWeak('./app.jsx')],
})();

export default Bot;
