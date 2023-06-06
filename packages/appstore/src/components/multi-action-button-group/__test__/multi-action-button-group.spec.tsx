import React from 'react';
import { screen, render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { createBrowserHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router';
import MultiActionButtonGroup from '../multi-action-button-group';
import { routes } from '@deriv/shared';

const mock_props = {
    link_to: routes.trade,
    onAction: jest.fn(),
    is_buttons_disabled: false,
    is_real: false,
};

describe('Test Cases for Multi Action Button Group:', () => {
    it('should render the component', () => {
        const history = createBrowserHistory();
        const mock = mockStore({
            modules: {
                cfd: {
                    dxtrade_tokens: '',
                },
            },
            traders_hub: {
                is_demo: true,
            },
        });
        render(
            <StoreProvider store={mock}>
                <Router history={history}>
                    <MultiActionButtonGroup {...mock_props} />
                </Router>
            </StoreProvider>
        );

        expect(screen.getByText('Top up')).toBeInTheDocument();
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('should render buttons accordingly', () => {
        const history = createBrowserHistory();
        const mock = mockStore({
            modules: {
                cfd: {
                    dxtrade_tokens: '',
                },
            },
            traders_hub: {
                is_demo: true,
            },
        });
        render(
            <StoreProvider store={mock}>
                <Router history={history}>
                    <MultiActionButtonGroup {...mock_props} is_real />
                </Router>
            </StoreProvider>
        );

        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('should disable "Transfer" button', () => {
        const history = createBrowserHistory();
        const mock = mockStore({
            modules: {
                cfd: {
                    dxtrade_tokens: '',
                },
            },
            traders_hub: {
                is_demo: true,
            },
        });
        render(
            <StoreProvider store={mock}>
                <Router history={history}>
                    <MultiActionButtonGroup {...mock_props} is_real is_buttons_disabled />
                </Router>
            </StoreProvider>
        );

        const transfer_btn = screen.getByRole('button', { name: 'Transfer' });
        const trade_btn = screen.getByRole('button', { name: 'Open' });

        expect(transfer_btn).toBeDisabled();
        expect(trade_btn).toBeEnabled();
    });

    it('should execute function after "Transfer" button is clicked', () => {
        const history = createBrowserHistory();
        const mock = mockStore({
            modules: {
                cfd: {
                    dxtrade_tokens: '',
                },
            },
            traders_hub: {
                is_demo: true,
            },
        });
        render(
            <StoreProvider store={mock}>
                <Router history={history}>
                    <MultiActionButtonGroup {...mock_props} is_real />
                </Router>
            </StoreProvider>
        );

        const transfer_btn = screen.getByText('Transfer');
        userEvent.click(transfer_btn);

        expect(mock_props.onAction).toHaveBeenCalled();
    });

    it('should redirect to Trade page after "Open" button is clicked', () => {
        const history = createBrowserHistory();
        const mock = mockStore({
            modules: {
                cfd: {
                    dxtrade_tokens: '',
                },
            },
            traders_hub: {
                is_demo: true,
            },
        });
        render(
            <StoreProvider store={mock}>
                <Router history={history}>
                    <MultiActionButtonGroup {...mock_props} is_real />
                </Router>
            </StoreProvider>
        );

        const trade_btn = screen.getByText('Open');
        userEvent.click(trade_btn);

        expect(history.location.pathname).toBe(routes.trade);
    });
});
