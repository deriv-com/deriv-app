import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';

const prefix = '/cashier-v2';

type TRoutes = `${typeof prefix}`;

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRoutes) => void };

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router: React.FC = () => {
    return (
        <Switch>
            <Route component={() => <Home path='Root' />} exact path={`${prefix}/`} />
        </Switch>
    );
};

export default Router;
