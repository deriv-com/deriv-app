import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../cashier-providers';
import CashierBreadcrumb from '../cashier-breadcrumb';

describe('<CashierBreadcrumb />', () => {
    it('should render proper crumbs for crypto deposit page', () => {
        const mock = mockStore({
            modules: {
                cashier: {
                    general_store: {
                        is_crypto: true,
                        is_deposit: true,
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );

        render(<CashierBreadcrumb />, { wrapper });

        expect(screen.getByText(/cashier/i)).toBeInTheDocument();
        expect(screen.getByText(/deposit cryptocurrencies/i)).toBeInTheDocument();
    });

    it('should render proper crumbs for fiat deposit page', () => {
        const mock = mockStore({
            modules: {
                cashier: {
                    general_store: {
                        is_crypto: false,
                        is_deposit: true,
                        setIsDeposit: jest.fn(),
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );

        render(<CashierBreadcrumb />, { wrapper });

        expect(screen.getByText(/cashier/i)).toBeInTheDocument();
        expect(screen.getByText(/deposit via bank wire, credit card, and e-wallet/i)).toBeInTheDocument();
    });
});
