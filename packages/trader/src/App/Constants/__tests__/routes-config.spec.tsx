import React, { ComponentProps } from 'react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { mockStore } from '@deriv/stores';
import { routes as routesList } from '@deriv/shared';
import { render, screen, waitFor } from '@testing-library/react';
import BinaryRoutes from 'App/Components/Routes';
import TraderProviders from '../../../trader-providers';
import getRoutesConfig from '../routes-config';

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

// to test lazy loaded components are loaded we need to render binary routes component that uses routes config
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

describe('Routes Config', () => {
    it('should return default routes config', () => {
        const routes = getRoutesConfig();
        expect(routes).toHaveLength(3);
    });

    it('should return routes with contract route', async () => {
        const routes = getRoutesConfig();
        expect(routes?.[0]?.path).toBe(routesList.contract);
        expect(routes?.[0]?.getTitle?.()).toBe('Contract Details');
        expect(routes?.[0]?.is_authenticated).toBe(true);
        const history = createMemoryHistory();
        history.push('/contract/12');
        render(<MockBinaryRoutes store={mockStore({})} history={history} is_logged_in is_logging_in />);
        await waitFor(() => {
            expect(screen.getByText('Contract Details')).toBeInTheDocument();
        });
    });

    it('should return routes with trade route', async () => {
        const routes = getRoutesConfig();
        expect(routes?.[1]?.path).toBe(routesList.trade);
        expect(routes?.[1]?.getTitle?.()).toBe('Trader');
        expect(routes?.[1]?.exact).toBe(true);
        const history = createMemoryHistory();
        history.push(routesList.trade);
        render(<MockBinaryRoutes store={mockStore({})} history={history} is_logged_in is_logging_in />);
        await waitFor(() => {
            expect(screen.getByText('Trader')).toBeInTheDocument();
        });
    });

    it('should return routes config with default route including 404', async () => {
        const routes = getRoutesConfig();
        expect(routes?.[2]?.getTitle?.()).toBe('Error 404');
        const history = createMemoryHistory();
        history.push('/non-existent-path');
        render(<MockBinaryRoutes store={mockStore({})} history={history} is_logged_in={false} is_logging_in={false} />);
        await waitFor(() => {
            expect(screen.getByText('Error 404')).toBeInTheDocument();
        });
    });
});
