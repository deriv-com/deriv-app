import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { routes } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { TCoreStores } from '@deriv/stores/types';
import BinaryRoutes from 'App/Components/Routes';
import Routes from '../routes';
import TraderProviders from '../../../../trader-providers';

jest.mock('App/Components/Routes', () => {
    return {
        __esModule: true,
        default: (props: React.ComponentProps<typeof BinaryRoutes>) => <div>BinaryRoutes {JSON.stringify(props)}</div>,
    };
});

jest.mock('App/Components/Elements/Errors', () => {
    return {
        __esModule: true,
        default: () => <div>ErrorComponent</div>,
    };
});

describe('Routes', () => {
    const history = createMemoryHistory();

    const renderMockedRoutes = (
        mockedStore: TCoreStores = mockStore({}),
        passthrough?: React.ComponentProps<typeof BinaryRoutes>['passthrough']
    ) => {
        render(
            <TraderProviders store={mockedStore}>
                <Router history={history}>
                    <Routes passthrough={passthrough} />
                </Router>
            </TraderProviders>
        );
    };

    it('should render BinaryRoutes', () => {
        history.push(routes.trade);
        renderMockedRoutes();
        expect(screen.getByText(/BinaryRoutes {"is_logged_in":false,"is_logging_in":false}/)).toBeInTheDocument();
    });
    it('should render ErrorComponent', async () => {
        renderMockedRoutes(
            mockStore({
                common: {
                    error: { message: 'Error message' },
                    has_error: true,
                },
            })
        );
        expect(screen.queryByText(/BinaryRoutes/)).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/ErrorComponent/)).toBeInTheDocument();
        });
    });
});
