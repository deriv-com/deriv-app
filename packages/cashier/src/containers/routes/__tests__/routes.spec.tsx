import React from 'react';
import { render, screen } from '@testing-library/react';
import Routes from '../routes';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../cashier-providers';

jest.mock('../binary-routes', () => jest.fn(() => 'BinaryRoutes'));
jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        PageErrorContainer: jest.fn(() => <div>An error occured</div>),
    };
});

describe('<Routes />', () => {
    it('should show error messages when "has_error = true"', () => {
        const history = createBrowserHistory();
        const mock_root_store = mockStore({
            client: {
                is_logged_in: false,
                is_logging_in: false,
            },
            common: {
                has_error: true,
                error: {
                    header: '',
                    message: '',
                    redirect_label: 'test label',
                    redirectOnClick: jest.fn(),
                    should_clear_error_on_click: true,
                    setError: jest.fn(),
                    redirect_to: '/testurl',
                    should_show_refresh: true,
                },
            },
        });

        render(
            <Router history={history}>
                <Routes />
            </Router>,
            {
                wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
            }
        );

        expect(screen.getByText('An error occured')).toBeInTheDocument();
    });

    it('should render <BinaryRoutes /> component when "has_error = false"', () => {
        const history = createBrowserHistory();
        const mock_root_store = mockStore({
            client: {
                is_logged_in: false,
                is_logging_in: false,
            },
            common: {
                has_error: false,
            },
        });

        render(
            <Router history={history}>
                <Routes />
            </Router>,
            {
                wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
            }
        );

        expect(screen.getByText('BinaryRoutes')).toBeInTheDocument();
    });
});
