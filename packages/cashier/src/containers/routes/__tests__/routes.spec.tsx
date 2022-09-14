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

jest.mock('../binary-routes', () => jest.fn(() => 'BinaryRoutes'));

describe('<Routes />', () => {
    it('should show error messages when "has_error = true"', () => {
        const history = createBrowserHistory();
        const error = {
            header: '',
            message: '',
            redirect_label: ['test label'],
            redirectOnClick: jest.fn(),
            should_clear_error_on_click: true,
            setError: jest.fn(),
            redirect_to: '/testurl',
            should_show_refresh: true,
        };
        render(
            <Router history={history}>
                <Routes has_error error={error} />
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
