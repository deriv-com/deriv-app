import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MyProfile } from '../pages';
import { useDevice } from '../hooks';
import { MobileCloseHeader } from '../components';
import Home from './Home';

const prefix = '/cashier/p2p-v2';

type TRoutes = `${typeof prefix}/cashier/p2p-v2` | `${typeof prefix}`;

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRoutes | string) => void };

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router: React.FC = () => {
    const { isMobile } = useDevice();
    return (
        <>
            {isMobile && <MobileCloseHeader />}
            <Switch>
                <Route component={() => <Home path='Inner' />} exact path={`${prefix}/inner`} />
                <Route component={() => <Home path='Root' />} exact path={`${prefix}/`} />
                <Route component={() => <MyProfile />} exact path={`${prefix}/my-profile`} />
            </Switch>
        </>
    );
};

export default Router;
