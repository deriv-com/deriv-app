import React from 'react';
import { render } from '@testing-library/react';
import TraderProviders from '../../../trader-providers';
import TradeFooterExtensions from '../trade-footer-extensions';
import { mockStore } from '@deriv/stores';
import { RouteComponentProps, Router } from 'react-router-dom';
import { MemoryHistory, createMemoryHistory } from 'history';
import { routes } from '@deriv/shared';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

describe('<TradeFooterExtensions>', () => {
    let mock_store: ReturnType<typeof mockStore>,
        router_prop: Partial<RouteComponentProps>,
        custom_history: MemoryHistory;
    beforeEach(() => {
        mock_store = {
            ...mockStore({
                client: {
                    is_logged_in: false,
                },
                portfolio: {
                    active_positions_count: 0,
                },
                ui: {
                    is_positions_drawer_on: false,
                    populateFooterExtensions: jest.fn(item => item[0]),
                },
            }),
        };
        custom_history = createMemoryHistory({ initialEntries: ['/test'] });
    });
    const renderTraderFooterExtensions = (props: Partial<RouteComponentProps>) => {
        custom_history = createMemoryHistory({ initialEntries: [props.location.pathname] });
        return render(
            <TraderProviders store={mock_store}>
                <Router history={custom_history}>
                    <TradeFooterExtensions {...props} />
                </Router>
            </TraderProviders>
        );
    };
    it('should call populateFooterExtensions with position left when is_logged_in is true and current pathname is same as routes.trade', () => {
        mock_store.client.is_logged_in = true;
        router_prop = {
            location: {
                pathname: routes.trade,
            },
        };
        renderTraderFooterExtensions(router_prop);
        expect(mock_store.ui.populateFooterExtensions).toHaveBeenCalledWith([
            { position: 'left', Component: expect.any(Function) },
        ]);
    });
    it('should call populateFooterExtensions with empty array when is_logged_in is false', () => {
        mock_store.client.is_logged_in = false;
        renderTraderFooterExtensions(router_prop);
        expect(mock_store.ui.populateFooterExtensions).toHaveBeenCalledWith([]);
    });
    it('should call populateFooterExtensions with empty array when pathname is not trader', () => {
        router_prop = {
            location: {
                pathname: routes.cashier,
            },
        };
        renderTraderFooterExtensions(router_prop);
        expect(mock_store.ui.populateFooterExtensions).toHaveBeenCalledWith([]);
    });
});
