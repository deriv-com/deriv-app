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
    test('should show fiat currency in identfier message for active fiat account', () => {
        const mock = mockStore({
            client: { currency: 'USD' },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingAccountIdentifierMessage />, { wrapper });

        expect(screen.queryByText('USD')).toBeInTheDocument();
    });

    test('should show crypto currency in identfier message for active crypto account', () => {
        const mock = mockStore({
            client: { currency: 'BTC' },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingAccountIdentifierMessage />, { wrapper });

        expect(screen.queryByText('USD')).not.toBeInTheDocument();
        expect(screen.queryByText('BTC')).toBeInTheDocument();
    });
});
