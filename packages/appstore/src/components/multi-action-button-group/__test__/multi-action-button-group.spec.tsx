import React from 'react';
import { screen, render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { createBrowserHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router';
import MultiActionButtonGroup from '../multi-action-button-group';
import { routes } from '@deriv/shared';

describe('Test Cases for Multi Action Button Group:', () => {
    it('should render the component', () => {
        const mock_props = {
            link_to: routes.trade,
            onAction: jest.fn(),
            is_buttons_disabled: false,
            is_real: false,
        };

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

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(
            <Router history={history}>
                <MultiActionButtonGroup {...mock_props} />
            </Router>,
            {
                wrapper,
            }
        );

        const top_up_btn = screen.getByRole('button', { name: /Top up/i });
        const trade_btn = screen.getByRole('button', { name: /Open/i });

        expect(container).toBeInTheDocument();
        expect(top_up_btn).toBeInTheDocument();
        expect(trade_btn).toBeInTheDocument();
    });

    it('should render buttons accordingly', () => {
        const mock_props = {
            link_to: routes.trade,
            onAction: jest.fn(),
            is_buttons_disabled: true,
            is_real: true,
        };

        const history = createBrowserHistory();
        const mock = mockStore({
            modules: {
                cfd: {
                    dxtrade_tokens: '',
                },
            },
            traders_hub: {
                is_demo: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(
            <Router history={history}>
                <MultiActionButtonGroup {...mock_props} />
            </Router>,
            {
                wrapper,
            }
        );

        const transfer_btn = screen.getByRole('button', { name: /Transfer/i });
        const trade_btn = screen.getByRole('button', { name: /Open/i });

        expect(container).toBeInTheDocument();
        expect(transfer_btn).toBeInTheDocument();
        expect(trade_btn).toBeInTheDocument();
    });

    it('should disabled button', () => {
        const mock_props = {
            link_to: routes.trade,
            onAction: jest.fn(),
            is_buttons_disabled: true,
            is_real: true,
        };
        const history = createBrowserHistory();
        const mock = mockStore({
            modules: {
                cfd: {
                    dxtrade_tokens: '',
                },
            },
            traders_hub: {
                is_demo: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(
            <Router history={history}>
                <MultiActionButtonGroup {...mock_props} />
            </Router>,
            {
                wrapper,
            }
        );

        const transfer_btn = screen.getByRole('button', { name: /Transfer/i });
        const trade_btn = screen.getByRole('button', { name: /Open/i });

        expect(container).toBeInTheDocument();
        expect(transfer_btn).toBeInTheDocument();
        expect(trade_btn).toBeInTheDocument();
        expect(transfer_btn).toBeDisabled();
        expect(trade_btn).toBeEnabled();
    });
    it('should execute function after button clicked', () => {
        const mock_props = {
            link_to: routes.trade,
            onAction: jest.fn(),
            is_buttons_disabled: false,
            is_real: true,
        };
        const history = createBrowserHistory();
        const mock = mockStore({
            modules: {
                cfd: {
                    dxtrade_tokens: '',
                },
            },
            traders_hub: {
                is_demo: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(
            <Router history={history}>
                <MultiActionButtonGroup {...mock_props} />
            </Router>,
            {
                wrapper,
            }
        );

        const transfer_btn = screen.getByRole('button', { name: /Transfer/i });
        const trade_btn = screen.getByRole('button', { name: /Open/i });

        expect(container).toBeInTheDocument();
        expect(transfer_btn).toBeInTheDocument();
        expect(trade_btn).toBeInTheDocument();
        userEvent.click(transfer_btn);
        expect(mock_props.onAction).toHaveBeenCalled();
    });

    it('should redirect after button clicked', () => {
        const mock_props = {
            link_to: routes.trade,
            onAction: jest.fn(),
            is_buttons_disabled: false,
            is_real: true,
        };
        const history = createBrowserHistory();
        const mock = mockStore({
            modules: {
                cfd: {
                    dxtrade_tokens: '',
                },
            },
            traders_hub: {
                is_demo: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(
            <Router history={history}>
                <MultiActionButtonGroup {...mock_props} />
            </Router>,
            {
                wrapper,
            }
        );

        const transfer_btn = screen.getByRole('button', { name: /Transfer/i });
        const trade_btn = screen.getByRole('button', { name: /Open/i });

        expect(container).toBeInTheDocument();
        expect(transfer_btn).toBeInTheDocument();
        expect(trade_btn).toBeInTheDocument();
        userEvent.click(trade_btn);
        expect(history.location.pathname).toBe(routes.trade);
    });
});
