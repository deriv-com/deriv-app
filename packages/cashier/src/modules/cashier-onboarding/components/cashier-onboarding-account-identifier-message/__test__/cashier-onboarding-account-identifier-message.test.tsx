import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierOnboardingAccountIdentifierMessage from '../cashier-onboarding-account-identifier-message';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    USD: { type: 'fiat', name: 'US Dollar' },
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                },
            },
        },
    })),
}));

describe('CashierOnboardingAccountIdentifierMessage', () => {
    test('should not show regulation for crypto accounts', () => {
        const mock = mockStore({
            client: { currency: 'BTC' },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingAccountIdentifierMessage />, { wrapper });

        expect(screen.queryByText(/EU/)).not.toBeInTheDocument();
        expect(screen.queryByText(/non-EU/)).not.toBeInTheDocument();
    });

    test('should not show regulation for low risk account', () => {
        const mock = mockStore({
            client: { currency: 'USD', is_low_risk: true },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingAccountIdentifierMessage />, { wrapper });

        expect(screen.queryByText(/EU/)).not.toBeInTheDocument();
        expect(screen.queryByText(/non-EU/)).not.toBeInTheDocument();
    });

    test('should show regulation for fiat currency', () => {
        const mock = mockStore({
            client: { currency: 'USD' },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingAccountIdentifierMessage />, { wrapper });

        expect(screen.queryByText(/non-EU/)).toBeInTheDocument();
    });
});
