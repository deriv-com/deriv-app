import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AccountTransferNoAccount from '../account-transfer-no-account';
import CashierProviders from '../../../../cashier-providers';
import { routes } from '@deriv/shared';

describe('<AccountTransferNoAccount />', () => {
    let mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            client: {
                is_dxtrade_allowed: false,
            },
            ui: {
                toggleAccountsDialog: jest.fn(),
            },
            traders_hub: { openModal: jest.fn(), closeModal: jest.fn() },
        };
    });

    const renderAccountTransferNoAccount = () => {
        render(<AccountTransferNoAccount />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });
    };

    it('should show "Transferring funds will require you to create a second account" message and "Back to traders hub" button', () => {
        mockRootStore.client.is_dxtrade_allowed = true;

        renderAccountTransferNoAccount();

        expect(screen.getByText('Transferring funds will require you to create a second account')).toBeInTheDocument();
        expect(screen.getByText(`Back to trader's hub`)).toBeInTheDocument();
    });

    it('should show "Transferring funds will require you to create a second account" message and "Back to traders hub" button', () => {
        renderAccountTransferNoAccount();

        expect(screen.getByText('Transferring funds will require you to create a second account')).toBeInTheDocument();
        expect(screen.getByText(`Back to trader's hub`)).toBeInTheDocument();
    });

    it('should trigger onClick callback, when the "Create account" button was clicked', () => {
        mockRootStore.client.is_dxtrade_allowed = true;

        renderAccountTransferNoAccount();

        const back_to_traders_hub_btn = screen.getByText(`Back to trader's hub`);
        fireEvent.click(back_to_traders_hub_btn);

        expect(history.location.pathname).toBe(routes.traders_hub);
    });
});
