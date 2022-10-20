import React from 'react';
import AccountTransferNoAccount from '../account-transfer-no-account';
import { fireEvent, render, screen } from '@testing-library/react';
import { StoreProvider } from '../../../../hooks';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

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
        };
    });

    it('should show "Please create another Deriv, Deriv MT5, or Deriv X account." message and "Create account" button', () => {
        mockRootStore.client.is_dxtrade_allowed = true;

        render(<AccountTransferNoAccount />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Please create another Deriv, Deriv MT5, or Deriv X account.')).toBeInTheDocument();
        expect(screen.getByText('Create account')).toBeInTheDocument();
    });

    it('should show "Please create another Deriv or Deriv MT5 account." message and "Create account" button', () => {
        render(<AccountTransferNoAccount />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Please create another Deriv or Deriv MT5 account.')).toBeInTheDocument();
        expect(screen.getByText('Create account')).toBeInTheDocument();
    });

    it('should trigger onClick callback, when the "Create account" button was clicked', () => {
        mockRootStore.client.is_dxtrade_allowed = true;

        render(<AccountTransferNoAccount />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });
        const create_acc_btn = screen.getByText('Create account');
        fireEvent.click(create_acc_btn);

        expect(mockRootStore.ui.toggleAccountsDialog).toHaveBeenCalledTimes(1);
    });
});
