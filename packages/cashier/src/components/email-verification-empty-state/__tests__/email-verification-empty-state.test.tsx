import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailVerificationEmptyState from '../email-verification-empty-state';
import { StoreProvider } from '@deriv/stores';
import { TRootStore } from 'Types';

const mock_store: DeepPartial<TRootStore> = {
    client: {
        email: 'john@company.com',
    },
};

describe('EmailVerificationEmptyState', () => {
    test('should disable resend button after sending the request', () => {
        render(<EmailVerificationEmptyState type='reset_password' />, {
            wrapper: ({ children }) => <StoreProvider store={mock_store as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.queryByTestId('dt_empty_state_action')).toBeInTheDocument();

        screen.queryByTestId('dt_empty_state_action')?.click();

        expect(screen.queryByTestId('dt_empty_state_action')).toBeDisabled();
    });

    // TODO: Add more test cases.
});
