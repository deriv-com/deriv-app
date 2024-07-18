import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import ResetEmailModal from '../reset-email-modal';
import { ConfirmEmailModal } from '../../ConfirmEmailModal/confirm-email-modal';

jest.mock('../../ConfirmEmailModal/confirm-email-modal', () => ({
    ConfirmEmailModal: jest.fn(({ is_open, onClose }: Partial<React.ComponentProps<typeof ConfirmEmailModal>>) =>
        is_open ? (
            <div>
                <p>ConfirmEmailModal</p>
                <button onClick={onClose}>Close</button>
            </div>
        ) : null
    ),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getErrorMessages: jest.fn(() => ({
        email: jest.fn(() => 'Invalid email address.'),
    })),
}));

describe('ResetEmailModal', () => {
    const input_placeholder = /Email address/i;
    const mock_store = mockStore({
        ui: {
            is_reset_email_modal_visible: true,
        },
        client: {
            email: 'test@example.com',
        },
    });
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children};</StoreProvider>
    );

    const renderComponent = () => {
        render(<ResetEmailModal />, { wrapper });
    };

    it('renders the reset email modal', () => {
        renderComponent();

        expect(screen.getByText(/Enter a new email address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(input_placeholder)).toBeInTheDocument();
        expect(screen.queryByText('ConfirmEmailModal')).not.toBeInTheDocument();
    });

    it('validates email input', async () => {
        renderComponent();

        const emailInput = screen.getByPlaceholderText(input_placeholder);
        const submitButton = screen.getByRole('button', { name: /Confirm/i });

        userEvent.type(emailInput, '');
        userEvent.tab();
        expect(await screen.findByText(/The email input should not be empty./i)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();

        userEvent.type(emailInput, 'test');
        userEvent.tab();
        expect(await screen.findByText(/Invalid email address./i)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });

    it('opens confirm email modal on valid email submission and handle closing', async () => {
        renderComponent();

        const emailInput = screen.getByPlaceholderText(input_placeholder);
        const submitButton = screen.getByText(/Confirm/i);

        userEvent.type(emailInput, 'new_email@example.com');
        userEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/ConfirmEmailModal/i)).toBeInTheDocument();
        });

        userEvent.click(screen.getByRole('button', { name: /Close/i }));
        await waitFor(() => {
            expect(screen.queryByText(/ConfirmEmailModal/i)).not.toBeInTheDocument();
        });
    });
});
