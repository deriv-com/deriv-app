import React from 'react';
import { makeLazyLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "account-app", webpackPreload: true */ './App.jsx'),
    props => {
        // 200ms default
        if (props.pastDelay) {
            return <Loading />;
        }
        return null;
    }
)();

export default App;
