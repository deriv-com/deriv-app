import React from 'react';
import { render, screen } from '@testing-library/react';
import CashierBreadcrumb from '../cashier-breadcrumb';

jest.mock('Stores/useCashierStores', () => ({
    ...jest.requireActual('Stores/useCashierStores'),
    useCashierStore: jest.fn(() => ({
        general_store: { setIsDeposit: jest.fn() },
    })),
}));

describe('<CashierBreadcrumb />', () => {
    it('should render proper crumbs for crypto deposit page', () => {
        render(<CashierBreadcrumb is_crypto_deposit />);

        expect(screen.getByText(/cashier/i)).toBeInTheDocument();
        expect(screen.getByText(/deposit cryptocurrencies/i)).toBeInTheDocument();
    });

    it('should render proper crumbs for fiat deposit page', () => {
        render(<CashierBreadcrumb />);

        expect(screen.getByText(/cashier/i)).toBeInTheDocument();
        expect(screen.getByText(/deposit via bank wire, credit card, and e-wallet/i)).toBeInTheDocument();
    });
});
