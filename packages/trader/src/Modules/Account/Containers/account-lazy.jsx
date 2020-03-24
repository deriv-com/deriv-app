import React from 'react';
import Lazy from 'App/Containers/Lazy';

const AccountLazy = ({ location, routes, history }) => {
    return (
        <Lazy
            location={location}
            routes={routes}
            history={history}
            ctor={() => import(/* webpackChunkName: "account" */ './account')}
        />
    );
};

export default AccountLazy;
