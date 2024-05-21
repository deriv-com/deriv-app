import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletTransactions from '../WalletTransactions';

jest.mock('../../../modules', () => ({
    TransactionsModule: () => <div data-testid='transactions-module'>Transactions Module</div>,
}));

describe('WalletTransactions', () => {
    it('should render the TransactionsModule component', () => {
        render(<WalletTransactions />);

        expect(screen.getByTestId('transactions-module')).toBeInTheDocument();
        expect(screen.getByTestId('transactions-module')).toHaveTextContent('Transactions Module');
    });
});
