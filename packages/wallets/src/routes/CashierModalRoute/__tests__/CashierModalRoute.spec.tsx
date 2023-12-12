import React from 'react';
import { render, screen } from '@testing-library/react';
import CashierModalRoute from '../CashierModalRoute';

jest.mock('../../../features/', () => {
    return { WalletCashier: () => <div>WalletCashier</div> };
});

describe('CashierModalRoute', () => {
    it('renders WalletCashier', () => {
        render(<CashierModalRoute />);
        expect(screen.getByText('WalletCashier')).toBeInTheDocument();
    });
});
