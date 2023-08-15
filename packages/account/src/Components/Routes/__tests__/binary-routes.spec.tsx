import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import BinaryRoutes from '../binary-routes';

jest.mock('../route-with-sub-routes', () => jest.fn(() => <div>RouteWithSubRoutes</div>));

jest.mock('Constants/routes-config', () => () => [{}]);

describe('<BinaryRoutes />', () => {
    const history = createBrowserHistory();

    it('should render BinaryRoutes with mocked route component', () => {
        render(
            <Router history={history}>
                <BinaryRoutes />
            </Router>
        );

        expect(screen.getByText('RouteWithSubRoutes')).toBeInTheDocument();
    });
});
