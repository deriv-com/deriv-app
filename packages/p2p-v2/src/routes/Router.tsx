import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';

const prefix = '/p2p-v2';

type TRoutes = `${typeof prefix}/cashier/p2p-v2` | `${typeof prefix}`;

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRoutes | string) => void };

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router: React.FC = () => {
    return (
        <Switch>
            <Route component={Home} path={`${prefix}/home`} />
        </Switch>
    );
};

export default Router;
