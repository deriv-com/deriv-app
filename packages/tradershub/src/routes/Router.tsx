import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppContainer } from '@/components';
import { CompareAccountsScreen } from '@cfd/screens';
import { TradersHubRoute } from './TradersHubRoute';

const prefix = '/traders-hub';

type TRoutes = `${typeof prefix}${'' | '/compare-accounts' | '/onboarding'}`;

declare module 'react-router-dom' {
    export function useHistory(): {
        location: { pathname: string; search: string };
        push: (path: string | { pathname: string; search: string; state?: Record<string, unknown> }) => void;
    };
    export function useRouteMatch(path: TRoutes): boolean;
}

const Router = () => {
    return (
        <Switch>
            <AppContainer className='max-w-[800px] lg:max-w-[1440px] lg:py-0'>
                <Route component={CompareAccountsScreen} path={`${prefix}/compare-accounts`} />
            </AppContainer>
            <AppContainer>
                <Route component={TradersHubRoute} path={prefix} />
            </AppContainer>
        </Switch>
    );
};

export default Router;
