import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { routes } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { TCoreStores } from '@deriv/stores/types';
import BinaryRoutes from 'App/Components/Routes';
import Routes, { checkRoutingMatch, tradePageMountingMiddleware } from '../routes';
import TraderProviders from '../../../../trader-providers';

const mockedBinaryRoutes = 'BinaryRoutes';
const mockedErrorComponent = 'ErrorComponent';

jest.mock('App/Components/Routes', () => jest.fn(() => mockedBinaryRoutes));
jest.mock('App/Components/Elements/Errors', () => jest.fn(() => mockedErrorComponent));

describe('Routes', () => {
    const history = createMemoryHistory();
    const store = mockStore({});

    const renderMockedRoutes = (
        mockedStore: TCoreStores = store,
        passthrough?: React.ComponentProps<typeof BinaryRoutes>['passthrough']
    ) => {
        return render(
            <TraderProviders store={mockedStore}>
                <Router history={history}>
                    <Routes passthrough={passthrough} />
                </Router>
            </TraderProviders>
        );
    };

    it('should render BinaryRoutes', () => {
        renderMockedRoutes();
        expect(screen.getByText(mockedBinaryRoutes)).toBeInTheDocument();
    });
    it('should render ErrorComponent', async () => {
        renderMockedRoutes(mockStore({ common: { has_error: true } }));
        expect(screen.queryByText(mockedBinaryRoutes)).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(mockedErrorComponent)).toBeInTheDocument();
        });
    });
});

describe('checkRoutingMatch', () => {
    const routeList = [routes.statement, routes.contract];
    it('should return true if the route matches', () => {
        expect(checkRoutingMatch(routeList, routes.contract)).toBeTruthy();
    });
    it('should return false if the route does not match', () => {
        expect(checkRoutingMatch(routeList, routes.trade)).toBeFalsy();
    });
    it('should return false if the path is not provided and routes.trade is missing from the route list', () => {
        expect(checkRoutingMatch(routeList)).toBeFalsy();
    });
    it('should return true if the path is not provided and routes.trade is on the route list', () => {
        expect(checkRoutingMatch([routes.trade, routes.contract])).toBeTruthy();
    });
});

describe('tradePageMountingMiddleware', () => {
    const TEST_ACTIONS = {
        PUSH: 'PUSH',
        POP: 'POP',
    };
    const pathTo = routes.contract;
    const pathFrom = routes.trade;
    const matchPatterns = [{ from: [routes.trade], to: [routes.contract] }];
    it('should call the callback with true when has a match and action is PUSH', () => {
        const callback = jest.fn();
        expect(
            tradePageMountingMiddleware({
                path_from: pathFrom,
                path_to: pathTo,
                action: TEST_ACTIONS.PUSH,
                match_patterns: matchPatterns,
                callback,
            })
        ).toBeTruthy();
        expect(callback).toHaveBeenCalledWith(true);
    });
    it('should call the callback with true when has a match and action is POP', () => {
        const callback = jest.fn();
        expect(
            tradePageMountingMiddleware({
                path_from: pathFrom,
                path_to: pathTo,
                action: TEST_ACTIONS.POP,
                match_patterns: matchPatterns,
                callback,
            })
        ).toBeTruthy();
        expect(callback).toHaveBeenCalledWith(true);
    });
    it('should call the callback with false when does not have a match', () => {
        const callback = jest.fn();
        expect(
            tradePageMountingMiddleware({
                path_from: pathFrom,
                path_to: routes.statement,
                action: TEST_ACTIONS.PUSH,
                match_patterns: matchPatterns,
                callback,
            })
        ).toBeTruthy();
        expect(callback).toHaveBeenCalledWith(false);
    });
});
