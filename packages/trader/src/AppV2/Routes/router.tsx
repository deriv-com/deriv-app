import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { UILoader } from '@deriv/components';
import traderRoutes from './routes';

const Router: React.FC = () => {
    return (
        <Suspense fallback={<UILoader />}>
            <Switch>
                {traderRoutes.map((route, index) => (
                    <Route key={index} path={route.path} exact={route.exact} component={route.component} />
                ))}
            </Switch>
        </Suspense>
    );
};

export default Router;
