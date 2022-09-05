import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailVerificationEmptyState from '../email-verification-empty-state';
import { StoreProvider } from '../../../hooks';
import { DeepPartial, TRootStore } from '../../../types';

const mock_store: DeepPartial<TRootStore> = {
    client: {
        email: 'john@company.com',
    },
};

describe('EmailVerificationEmptyState', () => {
    test('should disable resend button after sending the request', () => {
        render(<EmailVerificationEmptyState type='reset_password' />, {
            wrapper: ({ children }) => <StoreProvider store={mock_store}>{children}</StoreProvider>,
        });

        expect(screen.queryByTestId('empty-state-action')).toBeInTheDocument();

        screen.queryByTestId('empty-state-action')?.click();

        expect(screen.queryByTestId('empty-state-action')).toBeDisabled();
    });

    // TODO: Add more test cases.
});
