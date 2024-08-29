import React, { PropsWithChildren } from 'react';
import { useTradingPlatformInvestorPasswordChange } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WalletButton } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import useDevice from '../../../../../../hooks/useDevice';
import { validPasswordMT5 } from '../../../../../../utils/password-validation';
import MT5ChangeInvestorPasswordInputsScreen from '../MT5ChangeInvestorPasswordInputsScreen'; // Adjust the import path accordingly
import '@testing-library/jest-dom/extend-expect';

jest.mock('@deriv/api-v2', () => ({
    useTradingPlatformInvestorPasswordChange: jest.fn(),
}));

jest.mock('../../../../../../components', () => ({
    ...jest.requireActual('../../../../../../components'),
    WalletsActionScreen: jest.fn(({ description, renderButtons }) => (
        <div>
            {description}
            {renderButtons()}
        </div>
    )),
}));

jest.mock('../../../../../../components/Base', () => ({
    ...jest.requireActual('../../../../../../components/Base'),
    WalletButton: jest.fn(
        ({
            children,
            disabled,
            isLoading,
            onClick,
            type,
        }: PropsWithChildren<{
            disabled: boolean;
            isLoading: boolean;
            onClick: () => void;
            textSize: string;
            type?: 'button' | 'reset' | 'submit';
        }>) => {
            return (
                <button disabled={disabled} onClick={onClick} type={type}>
                    {isLoading && <>Loading...</>}
                    {!isLoading ? children : null}
                </button>
            );
        }
    ),
}));

jest.mock('../../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../../components/ModalProvider'),
    useModal: jest.fn(),
}));

jest.mock('../../../../../../components/Base/WalletPasswordField/PasswordViewerIcon', () =>
    jest.fn(({ setViewPassword, viewPassword }) => (
        <button onClick={() => setViewPassword(!viewPassword)}>PasswordViewerIcon</button>
    ))
);

jest.mock('../../../../../../hooks/useDevice', () => jest.fn());

jest.mock('../../../../../../utils/password-validation', () => ({
    ...jest.requireActual('../../../../../../utils/password-validation'),
    validPasswordMT5: jest.fn(),
}));

describe('MT5ChangeInvestorPasswordInputsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useTradingPlatformInvestorPasswordChange as jest.Mock).mockReturnValue({
            mutateAsync: jest.fn(),
            status: 'idle',
        });
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn().mockReturnValue('test-account-id'),
        });
        (useDevice as jest.Mock).mockReturnValue({
            isMobile: false,
        });
        (validPasswordMT5 as jest.Mock).mockReturnValue(true);
    });

    it('renders the component correctly', async () => {
        render(<MT5ChangeInvestorPasswordInputsScreen />);
        expect(screen.getByText(/Use this password to grant viewing access to another user/)).toBeInTheDocument();
        expect(screen.getByText(/Change investor password/)).toBeInTheDocument();
        expect(screen.getByText(/Create or reset investor password/)).toBeInTheDocument();
    });

    it('validates current password field', async () => {
        render(<MT5ChangeInvestorPasswordInputsScreen />);
        userEvent.click(screen.getByText('Current investor password'));
        userEvent.tab();
        userEvent.click(screen.getByText(/Change investor password/));

        await waitFor(() => {
            expect(screen.getByText('The field is required')).toBeInTheDocument();
        });
    });

    it('submits the form with valid data', async () => {
        const mockChangePassword = jest.fn().mockResolvedValue({});
        (useTradingPlatformInvestorPasswordChange as jest.Mock).mockReturnValue({
            mutateAsync: mockChangePassword,
        });

        render(<MT5ChangeInvestorPasswordInputsScreen setNextScreen={jest.fn()} />);

        userEvent.type(screen.getByLabelText(/Current investor password/), 'currentPassword123');
        const newInvestorPasswordInput = await screen.findByText('New investor password');
        userEvent.type(newInvestorPasswordInput, 'newPassword123');

        userEvent.click(screen.getByText(/Change investor password/));

        await waitFor(() => {
            expect(mockChangePassword).toHaveBeenCalledWith({
                account_id: 'test-account-id',
                new_password: 'newPassword123',
                old_password: 'currentPassword123',
                platform: 'mt5',
            });
        });
    });

    it('displays error message if change password fails', () => {
        (useTradingPlatformInvestorPasswordChange as jest.Mock).mockReturnValue({
            error: { error: { message: 'Error changing password' } },
            mutateAsync: jest.fn(),
        });

        render(<MT5ChangeInvestorPasswordInputsScreen />);
        expect(screen.getByText('Error changing password')).toBeInTheDocument();
    });
    it('shows the loader when the change investor password mutation is loading', () => {
        (useTradingPlatformInvestorPasswordChange as jest.Mock).mockReturnValue({
            status: 'loading',
        });

        render(<MT5ChangeInvestorPasswordInputsScreen />);
        expect(
            screen.getByRole('button', {
                name: 'Loading...',
            })
        ).toBeInTheDocument();
    });
    it('displays the password when the viewer icon is clicked', () => {
        render(<MT5ChangeInvestorPasswordInputsScreen />);
        const currentPasswordInput = screen.getByPlaceholderText('Current investor password');
        expect(currentPasswordInput).toHaveAttribute('type', 'password');
        userEvent.click(screen.getAllByRole('button', { name: 'PasswordViewerIcon' })[0]);
        expect(currentPasswordInput).toHaveAttribute('type', 'text');
    });
    it('renders button with correct text size', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<MT5ChangeInvestorPasswordInputsScreen />);
        expect(WalletButton).toHaveBeenCalledWith(expect.objectContaining({ textSize: 'md' }), {});
    });
});
