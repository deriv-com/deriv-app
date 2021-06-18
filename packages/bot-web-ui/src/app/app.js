import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const Bot = makeLazyLoader(
    () => import(/* webpackChunkName: "bot-web-ui-app", webpackPreload: true */ './app.jsx'),
    props => {
        // 200ms default
        if (props.pastDelay) {
            return <Loading />;
        }
        return null;
    }
)();

export default Bot;
