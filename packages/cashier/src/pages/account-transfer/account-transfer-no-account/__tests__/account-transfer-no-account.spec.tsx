import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AccountTransferNoAccount from '../account-transfer-no-account';
import CashierProviders from '../../../../cashier-providers';
import { routes } from '@deriv/shared';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { mockStore } from '@deriv/stores';

describe('<AccountTransferNoAccount />', () => {
    let mockRootStore: ReturnType<typeof mockStore>;
    const history = createBrowserHistory();
    beforeEach(() => {
        mockRootStore = mockStore({
            client: {
                is_dxtrade_allowed: false,
            },
            ui: {
                toggleAccountsDialog: jest.fn(),
            },
            traders_hub: { openModal: jest.fn(), closeModal: jest.fn() },
        });
    });

    const renderAccountTransferNoAccountWithRouter = () => {
        render(
            <Router history={history}>
                <AccountTransferNoAccount />
            </Router>,
            {
                wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
            }
        );
    };

    it('should show "Transferring funds will require you to create a second account." message and "Back to traders hub" button', () => {
        renderAccountTransferNoAccountWithRouter();

        expect(screen.getByText('Transferring funds will require you to create a second account.')).toBeInTheDocument();
        expect(screen.getByText("Back to Trader's Hub")).toBeInTheDocument();
    });

    it('should show "Transferring funds will require you to create a second account." message and "Back to traders hub" button when is_dxtrade_allowed=true', () => {
        mockRootStore.client.is_dxtrade_allowed = true;

        renderAccountTransferNoAccountWithRouter();

        expect(screen.getByText('Transferring funds will require you to create a second account.')).toBeInTheDocument();
        expect(screen.getByText("Back to Trader's Hub")).toBeInTheDocument();
    });

    it('should navigate to traders hub, when the "Back to traders hub" button was clicked', () => {
        renderAccountTransferNoAccountWithRouter();

        const back_to_traders_hub_btn = screen.getByText("Back to Trader's Hub");
        fireEvent.click(back_to_traders_hub_btn);

        expect(history.location.pathname).toBe(routes.traders_hub);
    });

    it('should navigate to traders hub, when the "Back to traders hub" button was clicked and is_dxtrade_allowed=true', () => {
        mockRootStore.client.is_dxtrade_allowed = true;

        renderAccountTransferNoAccountWithRouter();

        const back_to_traders_hub_btn = screen.getByText("Back to Trader's Hub");
        fireEvent.click(back_to_traders_hub_btn);

        expect(history.location.pathname).toBe(routes.traders_hub);
    });
});
