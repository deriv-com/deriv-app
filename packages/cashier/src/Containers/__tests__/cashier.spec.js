import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { isMobile } from '@deriv/shared';
import Cashier from '../cashier';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

jest.mock('@deriv/shared', () => {
    const original_module = jest.requireActual('@deriv/shared');

    return {
        ...original_module,
        isMobile: jest.fn(() => false),
        WS: {
            wait: (...payload) => {
                return Promise.resolve([...payload]);
            },
        },
    };
});

jest.mock('Components/account-prompt-dialog', () => jest.fn(() => 'mockedAccountPromptDialog'));
jest.mock('Components/error-dialog', () => jest.fn(() => 'mockedErrorDialog'));

describe('<Cashier />', () => {
    const props = {
        is_account_setting_loaded: true,
        is_account_transfer_visible: true,
        is_logged_in: true,
        is_payment_agent_transfer_visible: true,
        is_payment_agent_visible: true,
        is_p2p_enabled: true,
        is_onramp_tab_visible: true,
        is_visible: true,
        location: {
            pathname: '/cashier/deposit',
        },
        routes: [
            {
                path: '/cashier/deposit',
                component: jest.fn(() => 'mockedDeposit'),
                getTitle: () => 'Deposit',
                icon_component: 'IcCashierAdd',
                default: true,
            },
            {
                path: '/cashier/withdrawal',
                component: jest.fn(() => 'mockedWithdrawal'),
                getTitle: () => 'Withdrawal',
                icon_component: 'IcCashierMinus',
            },
            {
                path: '/cashier/account-transfer',
                component: jest.fn(() => 'mockedAccountTransfer'),
                getTitle: () => 'Transfer',
                icon_component: 'IcAccountTransfer',
            },
            {
                path: '/cashier/payment-agent',
                component: jest.fn(() => 'mockedPaymentAgent'),
                getTitle: () => 'Payment agents',
                icon_component: 'IcPaymentAgent',
            },
            {
                path: '/cashier/payment-agent-transfer',
                component: jest.fn(() => 'mockedPaymentAgentTransfer'),
                getTitle: () => 'Transfer to client',
                icon_component: 'IcAccountTransfer',
            },
            {
                path: '/cashier/p2p',
                component: jest.fn(() => 'mockedP2P'),
                getTitle: () => 'Deriv P2P',
                icon_component: 'IcDp2p',
            },
            {
                path: '/cashier/on-ramp',
                component: jest.fn(() => 'mockedOnRamp'),
                getTitle: () => 'Fiat onramp',
                icon_component: 'IcCashierOnRamp',
            },
        ],
        routeBackInApp: jest.fn(),
        onMount: jest.fn(),
        setAccountSwitchListener: jest.fn(),
        toggleCashier: jest.fn(),
    };

    it('should show the loading component if client_tnc_status is not yet loaded or not yet logged in', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Cashier {...props} is_logged_in={false} is_logging_in is_account_setting_loaded={false} />
            </Router>
        );

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render the component if client_tnc_status is loaded', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Cashier {...props} />
            </Router>
        );

        expect(screen.getByRole('link', { name: 'Deposit' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Withdrawal' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Transfer' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Payment agents' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Transfer to client' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Deriv P2P' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Fiat onramp' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Learn more about payment methods' })).toBeInTheDocument();
    });

    it('should go to payment methods page if the learn more about payment methods button is clicked', () => {
        const history = createBrowserHistory();

        window.open = jest.fn();

        render(
            <Router history={history}>
                <Cashier {...props} />
            </Router>
        );

        const learn_more_btn = screen.getByRole('button', { name: 'Learn more about payment methods' });
        fireEvent.click(learn_more_btn);

        expect(window.open).toHaveBeenCalledWith('https://deriv.com/payment-methods');
    });

    it('should redirect to trade page if the close button is clicked ', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Cashier {...props} />
            </Router>
        );

        const close_btn = screen.getByTestId('page_overlay_header_close');
        fireEvent.click(close_btn);

        expect(props.routeBackInApp).toHaveBeenCalledWith(history);
        expect(history.location.pathname).toBe('/');
    });

    it('should go to selected route page on desktop', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Cashier {...props} />
            </Router>
        );

        const withdrawal_link = screen.getByRole('link', { name: 'Withdrawal' });
        fireEvent.click(withdrawal_link);

        expect(history.location.pathname).toBe('/cashier/withdrawal');
    });

    it('should not render the side note if on crypto transactions page', () => {
        const history = createBrowserHistory();

        render(
            <Router history={history}>
                <Cashier is_crypto_transactions_visible {...props} />
            </Router>
        );

        expect(screen.queryByTestId('vertical_tab_side_note')).not.toBeInTheDocument();
    });

    it('should show the selected route page on mobile', () => {
        const history = createBrowserHistory();

        isMobile.mockReturnValue(true);

        render(
            <Router history={history}>
                <Cashier {...props} />
            </Router>
        );

        const payment_agent_link = screen.getByRole('link', { name: 'Payment agents' });
        fireEvent.click(payment_agent_link);

        expect(history.location.pathname).toBe('/cashier/payment-agent');
    });
});
