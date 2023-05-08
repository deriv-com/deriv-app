import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { PlatformContext } from '@deriv/shared';
import BinaryRoutes from '../binary-routes';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('../route-with-sub-routes', () => jest.fn(() => <div>RouteWithSubRoutes</div>));

jest.mock('Constants/routes-config', () => () => [{}]);

describe('<BinaryRoutes />', () => {
    const history = createBrowserHistory();

    it('should render BinaryRoutes with mocked route component', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: false, is_deriv_crypto: false, is_pre_appstore: false }}>
                <Router history={history}>
                    <BinaryRoutes />
                </Router>
            </PlatformContext.Provider>
        );

        expect(screen.getByText('RouteWithSubRoutes')).toBeInTheDocument();
    });
});
