import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AccountTransferNoAccount from '../account-transfer-no-account';
import CashierProviders from '../../../../cashier-providers';

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

    it('should show "Please create another Deriv, Deriv MT5, or Deriv X account." message and "Create account" button', () => {
        mockRootStore.client.is_dxtrade_allowed = true;

        renderAccountTransferNoAccount();

        expect(screen.getByText('Please create another Deriv, Deriv MT5, or Deriv X account.')).toBeInTheDocument();
        expect(screen.getByText('Create account')).toBeInTheDocument();
    });

    it('should show "Please create another Deriv or Deriv MT5 account." message and "Create account" button', () => {
        renderAccountTransferNoAccount();

        expect(screen.getByText('Please create another Deriv or Deriv MT5 account.')).toBeInTheDocument();
        expect(screen.getByText('Create account')).toBeInTheDocument();
    });
});
