import React from 'react';
import { render, screen } from '@testing-library/react';
import P2PCashier from '../p2p-cashier';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('@deriv/p2p', () => () => <div>P2P</div>);

describe('<P2PCashier />', () => {
    const history = createBrowserHistory();

    it('should render <Loading /> component', () => {
        render(
            <Router history={history}>
                <P2PCashier is_logging_in />
            </Router>
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render <P2P /> component', () => {
        render(
            <Router history={history}>
                <P2PCashier is_logging_in={false} />
            </Router>
        );

        expect(screen.getByText('P2P')).toBeInTheDocument();
    });

    it('should redirect to "/cashier/p2p" page with "?order=1" query parameter', () => {
        const history_copy = { ...history, location: { ...history.location, search: 'order=1' } };

        render(
            <Router history={history_copy}>
                <P2PCashier is_logging_in={false} />
            </Router>
        );

        expect(history.location.pathname).toBe(routes.cashier_p2p);
    });
});
