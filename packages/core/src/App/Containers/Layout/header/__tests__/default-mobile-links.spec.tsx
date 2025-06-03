import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { BrowserHistory, createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';
import DefaultMobileLinks from '../default-mobile-links';
import { useIsRealAccountNeededForCashier } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useIsRealAccountNeededForCashier: jest.fn(() => false),
}));
jest.mock('App/Components/Routes', () => ({
    BinaryLink: jest.fn(() => <div data-testid='dt_binary_link'>MockedBinaryLink to Account Settings</div>),
}));
jest.mock('../show-notifications', () =>
    jest.fn(() => <div data-testid='dt_show_notifications'>MockedShowNotifications</div>)
);

jest.mock('../traders-hub-onboarding', () => jest.fn(() => <div>MockedTradersHubOnboarding</div>));

describe('DefaultMobileLinks', () => {
    let history: BrowserHistory, mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mock_store = mockStore({
            client: { has_wallet: false, has_any_real_account: true, is_virtual: false },
            ui: {
                toggleNeedRealAccountForCashierModal: jest.fn(),
                toggleReadyToDepositModal: jest.fn(),
            },
        });
        history = createBrowserHistory();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => {
        return (
            <StoreProvider store={mock_store}>
                <Router history={history}>{children}</Router>
            </StoreProvider>
        );
    };

    it('should render "DefaultMobileLinks" with Onboarding, Notifications & link to Account Settings for wallet', () => {
        mock_store.client.has_wallet = true;
        render(<DefaultMobileLinks />, { wrapper });
        expect(screen.getByText('MockedTradersHubOnboarding')).toBeInTheDocument();
        expect(screen.getByText('MockedShowNotifications')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: '' })).toHaveClass('traders-hub-header__setting');
    });

    it('should render "DefaultMobileLinks" with Notifications & link to Account Settings for non wallet path', () => {
        render(<DefaultMobileLinks />, { wrapper });
        expect(screen.queryByText('MockedTradersHubOnboarding')).not.toBeInTheDocument();
        expect(screen.getByText('MockedShowNotifications')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: '' })).toHaveClass('traders-hub-header__setting');
    });
    it('should display the cashier button', () => {
        render(<DefaultMobileLinks />, { wrapper });
        expect(screen.getByRole('button', { name: 'Cashier' })).toBeInTheDocument();
    });

    it('should trigger `toggleReadyToDepositModal` if user does not have any real account and active account is virtual', async () => {
        mock_store.client.has_any_real_account = false;
        mock_store.client.is_virtual = true;
        render(<DefaultMobileLinks />, { wrapper });
        const cashierButton = screen.getByRole('button', { name: 'Cashier' });
        await userEvent.click(cashierButton);
        expect(mock_store.ui.toggleReadyToDepositModal).toHaveBeenCalledTimes(1);
    });

    it('should trigger `toggleNeedRealAccountForCashierModal` if user does not have any real regulated account', async () => {
        (useIsRealAccountNeededForCashier as jest.Mock).mockReturnValueOnce(true);
        render(<DefaultMobileLinks />, { wrapper });
        const cashierButton = screen.getByRole('button', { name: 'Cashier' });
        await userEvent.click(cashierButton);
        expect(mock_store.ui.toggleNeedRealAccountForCashierModal).toHaveBeenCalledTimes(1);
    });

    it('should navigate to `/cashier/deposit` if user has real account', async () => {
        render(<DefaultMobileLinks />, { wrapper });
        const cashierButton = screen.getByRole('button', { name: 'Cashier' });
        await userEvent.click(cashierButton);
        expect(history.location.pathname).toBe(routes.cashier_deposit);
    });
});
