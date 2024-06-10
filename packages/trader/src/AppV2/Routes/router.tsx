import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { UILoader } from '@deriv/components';
import traderRoutes from './routes';

const Router: React.FC = () => {
    return (
        <Suspense fallback={<UILoader />}>
            <BrowserRouter>
                <Switch>
                    {traderRoutes.map((route, index) => (
                        <Route key={index} path={route.path} exact={route.exact} component={route.component} />
                    ))}
                </Switch>
            </BrowserRouter>
        </Suspense>
    );
};

export default Router;
