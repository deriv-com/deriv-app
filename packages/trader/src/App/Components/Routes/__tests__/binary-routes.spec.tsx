import React, { ComponentProps } from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import BinaryRoutes from '../binary-routes';
import TraderProviders from '../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

jest.mock('Modules/Contract', () => {
    return {
        __esModule: true,
        default: () => <div>Contract Details</div>,
    };
});

jest.mock('Modules/Trading', () => {
    return {
        __esModule: true,
        default: () => <div>Trader</div>,
    };
});

jest.mock('Modules/Page404', () => {
    return {
        __esModule: true,
        default: () => <div>Error 404</div>,
    };
});

const MockBinaryRoutes = (
    props: ComponentProps<typeof TraderProviders> & ComponentProps<typeof BinaryRoutes> & ComponentProps<typeof Router>
) => {
    return (
        <TraderProviders store={props.store}>
            <Router history={props.history}>
                <BinaryRoutes is_logged_in={props.is_logged_in} is_logging_in={props.is_logging_in} />
            </Router>
        </TraderProviders>
    );
};

describe('BinaryRoutes', () => {
    it('should render contract route', async () => {
        const history = createMemoryHistory();
        history.push('/contract/12');
        render(<MockBinaryRoutes store={mockStore({})} history={history} is_logged_in is_logging_in />);
        await waitFor(() => {
            expect(screen.getByText('Contract Details')).toBeInTheDocument();
        });
    });

    it('should render trade route', async () => {
        const history = createMemoryHistory();
        history.push('/');
        render(<MockBinaryRoutes store={mockStore({})} history={history} is_logged_in is_logging_in />);
        await waitFor(() => {
            expect(screen.getByText('Trader')).toBeInTheDocument();
        });
    });

    it('should render 404 route', async () => {
        const history = createMemoryHistory();
        history.push('/non-existent-path');
        render(<MockBinaryRoutes store={mockStore({})} history={history} is_logged_in is_logging_in />);
        await waitFor(() => {
            expect(screen.getByText('Error 404')).toBeInTheDocument();
        });
    });

    it('should redirect to login if not logged in and not logging in', async () => {
        const history = createMemoryHistory();
        history.push('/contract/12');
        render(<MockBinaryRoutes store={mockStore({})} history={history} is_logged_in={false} is_logging_in={false} />);
        Object.defineProperty(window, 'location', {
            value: new URL('https://www.app.deriv.com'),
            writable: true,
        });
        await waitFor(() => {
            expect(window.location.href).toMatch(/^https:\/\/oauth\.deriv\.com\/oauth2\/authorize?/);
        });
    });
});
