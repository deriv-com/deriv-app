import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { isMobile } from '@deriv/shared';
import getRoutesConfig from 'Constants/routes-config';
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
jest.mock('Pages/deposit', () => jest.fn(() => 'mockedDeposit'));
jest.mock('Pages/withdrawal', () => jest.fn(() => 'mockedWithdrawal'));

describe('<Cashier />', () => {
    let history;
    const renderWithRouter = component => {
        history = createBrowserHistory();
        return {
            ...render(<Router history={history}>{component}</Router>),
        };
    };

    const props = {
        is_account_setting_loaded: true,
        is_account_transfer_visible: true,
        is_logged_in: true,
        is_payment_agent_transfer_visible: true,
        is_payment_agent_visible: true,
        is_p2p_enabled: true,
        is_onramp_tab_visible: true,
        is_visible: true,
        routes: getRoutesConfig()[0].routes,
        routeBackInApp: jest.fn(),
        onMount: jest.fn(),
        setAccountSwitchListener: jest.fn(),
        toggleCashier: jest.fn(),
        resetLastLocation: jest.fn(),
    };

    it('should show the loading component if client_tnc_status is not yet loaded or not yet logged in', () => {
        renderWithRouter(<Cashier {...props} is_logged_in={false} is_logging_in is_account_setting_loaded={false} />);

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render the component if client_tnc_status is loaded', () => {
        renderWithRouter(<Cashier {...props} />);

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
        window.open = jest.fn();

        renderWithRouter(<Cashier {...props} />);

        const learn_more_btn = screen.getByRole('button', { name: 'Learn more about payment methods' });
        fireEvent.click(learn_more_btn);

        expect(window.open).toHaveBeenCalledWith('https://deriv.com/payment-methods');
    });

    it('should redirect to trade page if the close button is clicked ', () => {
        renderWithRouter(<Cashier {...props} />);

        const close_btn = screen.getByTestId('page_overlay_header_close');
        fireEvent.click(close_btn);

        expect(props.routeBackInApp).toHaveBeenCalledWith(history);
        expect(history.location.pathname).toBe('/');
    });

    it('should go to selected route page on desktop', () => {
        renderWithRouter(<Cashier {...props} />);

        const withdrawal_link = screen.getByRole('link', { name: 'Withdrawal' });
        fireEvent.click(withdrawal_link);

        expect(history.location.pathname).toBe('/cashier/withdrawal');
    });

    it('should not render the side note if on crypto transactions page', () => {
        renderWithRouter(<Cashier is_crypto_transactions_visible {...props} />);

        expect(screen.queryByTestId('vertical_tab_side_note')).not.toBeInTheDocument();
    });

    it('should show the selected route page on mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        renderWithRouter(<Cashier {...props} />);

        const withdrawal_link = screen.getByRole('link', { name: 'Withdrawal' });
        fireEvent.click(withdrawal_link);

        expect(history.location.pathname).toBe('/cashier/withdrawal');
    });
});
