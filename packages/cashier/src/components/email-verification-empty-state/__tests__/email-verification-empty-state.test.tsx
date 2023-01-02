import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailVerificationEmptyState from '../email-verification-empty-state';
import { StoreProvider } from '@deriv/stores';
import { TRootStore } from '../../../types';
import { useVerifyEmail } from '@deriv/hooks';
import { VerifyEmail } from '@deriv/api-types';

const mock_store: DeepPartial<TRootStore> = {
    client: {
        email: 'john@company.com',
    },
};

describe('EmailVerificationEmptyState', () => {
    const verify: ReturnType<typeof useVerifyEmail> = {
        is_loading: false,
        error: '',
        data: {} as VerifyEmail,
        counter: 58,
        is_counter_running: true,
        sent_count: 2,
        has_been_sent: true,
        send: jest.fn(),
    };
    test('should disable resend button after sending the request', () => {
        render(<EmailVerificationEmptyState verify={verify} />, {
            wrapper: ({ children }) => <StoreProvider store={mock_store as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.queryByTestId('dt_empty_state_action')).toBeInTheDocument();

        screen.queryByTestId('dt_empty_state_action')?.click();

        expect(screen.queryByTestId('dt_empty_state_action')).toBeDisabled();
    });

    // TODO: Add more test cases.
});
