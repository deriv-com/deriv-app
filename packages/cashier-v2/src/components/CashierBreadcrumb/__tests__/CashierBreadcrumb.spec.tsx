import React from 'react';
import { render, screen } from '@testing-library/react';
import CashierBreadcrumb from '../CashierBreadcrumb';

describe('<CashierBreadcrumb />', () => {
    it('should render proper crumbs for crypto deposit page', () => {
        render(<CashierBreadcrumb isCrypto setIsDeposit={jest.fn()} />);

        expect(screen.getByText(/cashier/i)).toBeInTheDocument();
        expect(screen.getByText(/deposit cryptocurrencies/i)).toBeInTheDocument();
    });

    it('should render proper crumbs for fiat deposit page', () => {
        render(<CashierBreadcrumb isCrypto={false} setIsDeposit={jest.fn()} />);

        expect(screen.getByText(/cashier/i)).toBeInTheDocument();
        expect(screen.getByText(/deposit via bank wire, credit card, and e-wallet/i)).toBeInTheDocument();
    });
});
