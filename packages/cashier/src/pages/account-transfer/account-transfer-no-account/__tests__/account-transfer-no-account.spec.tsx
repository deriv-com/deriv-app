import React from 'react';
import AccountTransferNoAccount from '../account-transfer-no-account';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<AccountTransferNoAccount />', () => {
    it('should show "Please create another Deriv, Deriv MT5, or Deriv X account." message and "Create account" button', () => {
        render(<AccountTransferNoAccount is_dxtrade_allowed />);

        expect(screen.getByText('Please create another Deriv, Deriv MT5, or Deriv X account.')).toBeInTheDocument();
        expect(screen.getByText('Create account')).toBeInTheDocument();
    });

    it('should show "Please create another Deriv or Deriv MT5 account." message and "Create account" button', () => {
        render(<AccountTransferNoAccount is_dxtrade_allowed={false} />);

        expect(screen.getByText('Please create another Deriv or Deriv MT5 account.')).toBeInTheDocument();
        expect(screen.getByText('Create account')).toBeInTheDocument();
    });

    it('should trigger onClick callback, when the "Create account" button was clicked', () => {
        const toggleAccountsDialog = jest.fn();
        render(<AccountTransferNoAccount is_dxtrade_allowed toggleAccountsDialog={toggleAccountsDialog} />);
        const create_acc_btn = screen.getByText('Create account');
        fireEvent.click(create_acc_btn);

        expect(toggleAccountsDialog).toHaveBeenCalledTimes(1);
    });
});
