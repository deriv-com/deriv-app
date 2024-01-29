import React from 'react';
import { MyProfile } from '../pages';
import { useDevice } from '../hooks';
import { MobileCloseHeader } from '../components';
import Home from './Home';
import { Route, Switch, useHistory } from 'react-router-dom';
import { routesConfiguration } from './AppContent';

const prefix = '/cashier/p2p-v2';

type TRoutes = `${typeof prefix}/cashier/p2p-v2` | `${typeof prefix}`;

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRoutes | string) => void };

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router: React.FC = () => {
    const { isMobile } = useDevice();
    const history = useHistory();

    if (history.location.pathname === prefix) {
        history.push(`${prefix}/${routesConfiguration[0].path}`);
    }
    return (
        <>
            {isMobile && <MobileCloseHeader />}
            <Switch>
                {routesConfiguration.map(({ Component, path }) => (
                    <Route key={path} path={path}>
                        {Component}
                    </Route>
                ))}
            </Switch>
        </>
    );
};

export default Router;
