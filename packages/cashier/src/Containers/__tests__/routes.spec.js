import React from 'react';
import { render, screen } from '@testing-library/react';
import Routes from '../routes';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('Components/Routes/binary-routes', () => () => <div>BinaryRoutes</div>);

describe('<Routes />', () => {
    it('should show error messages when "has_error = true"', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Routes has_error />
            </Router>
        );

        expect(screen.getByText('Something’s not right')).toBeInTheDocument();
        expect(screen.getByText('Sorry, an error occured while processing your request.')).toBeInTheDocument();
        expect(screen.getByText('Please refresh this page to continue.')).toBeInTheDocument();
    });

    it('should render <BinaryRoutes /> component when "has_error = false"', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Routes has_error={false} />
            </Router>
        );

        expect(screen.getByText('BinaryRoutes')).toBeInTheDocument();
    });
});
