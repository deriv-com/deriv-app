import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { routes } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { TCoreStores } from '@deriv/stores/types';
import BinaryRoutes from '../binary-routes';
import TraderProviders from '../../../../trader-providers';

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

describe('BinaryRoutes', () => {
    const history = createMemoryHistory();

    const mockedProps = {
        is_logged_in: true,
        is_logging_in: false,
    };

    const renderMockBinaryRoutes = (
        mockedStore: TCoreStores = mockStore({}),
        props: React.ComponentProps<typeof BinaryRoutes> = mockedProps
    ) => {
        render(
            <TraderProviders store={mockedStore}>
                <Router history={history}>
                    <BinaryRoutes {...props} />
                </Router>
            </TraderProviders>
        );
    };

    it('should render contract route', async () => {
        history.push(routes.contract);
        renderMockBinaryRoutes();
        await waitFor(() => {
            expect(screen.getByText('Contract Details')).toBeInTheDocument();
        });
    });

    it('should render trade route', async () => {
        history.push(routes.trade);
        renderMockBinaryRoutes();
        await waitFor(() => {
            expect(screen.getByText('Trader')).toBeInTheDocument();
        });
    });

    it('should render 404 route', async () => {
        history.push('/non-existent-path');
        renderMockBinaryRoutes();
        await waitFor(() => {
            expect(screen.getByText('Error 404')).toBeInTheDocument();
        });
    });

    it('should redirect to login if not logged in and not logging in', async () => {
        history.push(routes.contract);
        renderMockBinaryRoutes(mockStore({}), { ...mockedProps, is_logged_in: false });
        Object.defineProperty(window, 'location', {
            value: new URL('https://www.app.deriv.com'),
            writable: true,
        });
        await waitFor(() => {
            expect(window.location.href).toMatch(/^https:\/\/oauth\.deriv\.com\/oauth2\/authorize?/);
        });
    });
});
