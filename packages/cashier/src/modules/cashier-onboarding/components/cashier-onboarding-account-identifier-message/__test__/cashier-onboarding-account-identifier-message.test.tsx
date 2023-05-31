import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierOnboardingAccountIdentifierMessage from '../cashier-onboarding-account-identifier-message';

describe('CashierOnboardingAccountIdentifierMessage', () => {
    test('should render cashier onboarding title', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CashierOnboardingAccountIdentifierMessage />, { wrapper });

        const title = screen.queryByTestId('dt_cashier_onboarding_title');

        expect(title).toBeInTheDocument();
    });
});
