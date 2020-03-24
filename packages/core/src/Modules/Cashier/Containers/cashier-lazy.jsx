import React from 'react';
import Lazy from 'App/Containers/Lazy';

const CashierLazy = ({ location, routes, history }) => {
    return (
        <Lazy
            location={location}
            routes={routes}
            history={history}
            ctor={() => import(/* webpackChunkName: "cashier" */ './cashier')}
        />
    );
};

export default CashierLazy;
