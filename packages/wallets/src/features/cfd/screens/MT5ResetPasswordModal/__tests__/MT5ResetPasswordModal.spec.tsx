import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MT5ResetPasswordModal from '../MT5ResetPasswordModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    WalletPasswordFieldLazy: ({
        label,
        onChange,
        password,
        serverErrorMessage,
    }: {
        label: string;
        onChange: () => void;
        password: string;
        serverErrorMessage?: string;
    }) => (
        <>
            <input
                data-testid='dt_password_field'
                onChange={onChange}
                placeholder={label}
                type='password'
                value={password}
            />
            {serverErrorMessage && <div>{serverErrorMessage}</div>}
        </>
    ),
}));

jest.mock('../../../../../utils/password-validation', () => ({
    validPasswordMT5: jest.fn(() => ({})),
}));

describe('MT5ResetPasswordModal', () => {
    const mockOnSubmit = jest.fn();
    const mockSendEmailVerification = jest.fn();

    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <MT5ResetPasswordModal
                formError={null}
                isLoading={false}
                onClickSubmitPasswordChange={mockOnSubmit}
                sendEmailVerification={mockSendEmailVerification}
            />
        );

        expect(screen.getByText('Deriv MT5 latest password requirements')).toBeInTheDocument();
        expect(screen.getByText('Change my password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Current password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
    });

    it('displays the correct error message for invalid current password', async () => {
        const formError = { error: { code: 'PasswordError', message: 'Invalid password' } };

        render(
            <MT5ResetPasswordModal
                // @ts-expect-error Partial error mock
                formError={formError}
                isLoading={false}
                onClickSubmitPasswordChange={mockOnSubmit}
                sendEmailVerification={mockSendEmailVerification}
            />
        );

        expect(screen.getByText('Invalid password')).toBeInTheDocument();
    });

    it('displays the correct error message for other error messages', async () => {
        const formError = { error: { code: 'Error', message: 'Error message' } };

        render(
            <MT5ResetPasswordModal
                // @ts-expect-error Partial error mock
                formError={formError}
                isLoading={false}
                onClickSubmitPasswordChange={mockOnSubmit}
                sendEmailVerification={mockSendEmailVerification}
            />
        );

        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('calls sendEmailVerification when forgot password button is clicked', async () => {
        render(
            <MT5ResetPasswordModal
                formError={null}
                isLoading={false}
                onClickSubmitPasswordChange={mockOnSubmit}
                sendEmailVerification={mockSendEmailVerification}
            />
        );

        await userEvent.click(screen.getByText('Forgot password?'));
        expect(mockSendEmailVerification).toHaveBeenCalledTimes(1);
    });

    it('calls onClickSubmitPasswordChange on form submission', async () => {
        render(
            <MT5ResetPasswordModal
                formError={null}
                isLoading={false}
                onClickSubmitPasswordChange={mockOnSubmit}
                sendEmailVerification={mockSendEmailVerification}
            />
        );

        const currentPasswordInput = screen.getByPlaceholderText('Current password');
        const newPasswordInput = screen.getByPlaceholderText('New Password');

        await userEvent.type(currentPasswordInput, 'Abcd1234!');
        await userEvent.type(newPasswordInput, 'Password123!');
        await userEvent.click(screen.getByText('Change my password'));
        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });
    });

    it('does not render the header on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(
            <MT5ResetPasswordModal
                formError={null}
                isLoading={false}
                onClickSubmitPasswordChange={mockOnSubmit}
                sendEmailVerification={mockSendEmailVerification}
            />
        );

        expect(screen.queryByText(/latest password requirements/)).not.toBeInTheDocument();
    });
});
