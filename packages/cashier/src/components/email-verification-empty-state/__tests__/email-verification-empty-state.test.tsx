import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailVerificationEmptyState from '../email-verification-empty-state';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../cashier-providers';

const mock_store = mockStore({
    client: {
        email: 'john@company.com',
    },
});

describe('EmailVerificationEmptyState', () => {
    test('should disable resend button after sending the request', () => {
        render(<EmailVerificationEmptyState type='reset_password' />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.queryByTestId('dt_empty_state_action')).toBeInTheDocument();

        screen.queryByTestId('dt_empty_state_action')?.click();

        expect(screen.queryByTestId('dt_empty_state_action')).toBeDisabled();
    });

    test('should render the default icon if icon is not provided', () => {
        render(<EmailVerificationEmptyState type='reset_password' />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.queryByTestId('dt_empty_state_action')).toBeInTheDocument();

        screen.queryByTestId('dt_empty_state_action')?.click();

        expect(screen.queryByTestId('dt_empty_state_action')).toBeDisabled();
        expect(screen.queryByTestId('dt_empty_state_icon_IcEmailSent')).toBeInTheDocument();
    });

    test('should render the proper icon', () => {
        render(<EmailVerificationEmptyState type='reset_password' icon='IcWalletEmailVerification' />, {
            wrapper: ({ children }) => <CashierProviders store={mock_store}>{children}</CashierProviders>,
        });

        expect(screen.queryByTestId('dt_empty_state_action')).toBeInTheDocument();

        screen.queryByTestId('dt_empty_state_action')?.click();

        expect(screen.queryByTestId('dt_empty_state_action')).toBeDisabled();
        expect(screen.queryByTestId('dt_empty_state_icon_IcWalletEmailVerification')).toBeInTheDocument();
    });
});
