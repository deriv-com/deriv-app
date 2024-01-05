import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';

const prefix = '/cashier/p2p-v2';

type TRoutes = `${typeof prefix}/cashier/p2p-v2` | `${typeof prefix}`;

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRoutes | string) => void };

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router: React.FC = () => {
    return (
        <div>
            <ul>
                <li>test1</li>
                <li>test2</li>
                <li>test3</li>
            </ul>
            <Switch>
                <Route component={() => <Home path='x' />} exact path={`${prefix}/x`} />
                <Route component={() => <Home path='Root' />} exact path={`${prefix}/`} />
            </Switch>
        </div>
    );
};

export default Router;
