import React from 'react';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useCreateOtherCFDAccount,
    useDxtradeAccountsList,
} from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '../../../../../components/ModalProvider';
import useSendPasswordResetEmail from '../../../../../hooks/useSendPasswordResetEmail';
import DxtradeEnterPasswordModal from '../DxtradeEnterPasswordModal';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockPush,
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('@deriv/api-v2');
jest.mock('../../../../../hooks/useSendPasswordResetEmail');

const mockHide = jest.fn();
jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../../../../components/ModalProvider').useModal(),
        hide: mockHide,
        show: jest.fn(),
    })),
}));

jest.mock('../../CreatePasswordModal', () => ({
    CreatePasswordModal: ({
        onPasswordChange,
        onPrimaryClick,
        password,
    }: {
        onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onPrimaryClick: () => void;
        password: string;
    }) => (
        <div>
            CreatePasswordModal
            <input data-testid='dt_password_input' onChange={onPasswordChange} value={password} />
            <button onClick={onPrimaryClick}>Submit</button>
        </div>
    ),
}));

jest.mock('../../EnterPasswordModal', () => ({
    EnterPasswordModal: ({
        onPasswordChange,
        onPrimaryClick,
        onSecondaryClick,
    }: {
        onPasswordChange: () => void;
        onPrimaryClick: () => void;
        onSecondaryClick: () => void;
    }) => (
        <div>
            EnterPasswordModal
            <input data-testid='dt_password_input' onChange={onPasswordChange} />
            <button onClick={onPrimaryClick}>Submit</button>
            <button onClick={onSecondaryClick}>Forgot Password</button>
        </div>
    ),
}));

jest.mock('../../PasswordLimitExceededModal', () => ({
    PasswordLimitExceededModal: ({
        onPrimaryClick,
        onSecondaryClick,
    }: {
        onPrimaryClick: () => void;
        onSecondaryClick: () => void;
    }) => (
        <div>
            PasswordLimitExceededModal
            <button onClick={onPrimaryClick}>OK</button>
            <button onClick={onSecondaryClick}>Reset Password</button>
        </div>
    ),
}));

jest.mock('../../SuccessModal', () => ({
    SuccessModal: ({
        onPrimaryClick,
        onSecondaryClick,
    }: {
        onPrimaryClick: () => void;
        onSecondaryClick: () => void;
    }) => (
        <div>
            SuccessModal
            <button onClick={onPrimaryClick}>Transfer</button>
            <button onClick={onSecondaryClick}>Maybe Later</button>
        </div>
    ),
}));

describe('DxtradeEnterPasswordModal', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { currency: 'USD', is_virtual: false },
        });
        (useDxtradeAccountsList as jest.Mock).mockReturnValue({
            data: undefined,
            isSuccess: true,
        });
        (useAccountStatus as jest.Mock).mockReturnValue({
            data: undefined,
            isSuccess: true,
        });
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            isSuccess: false,
            status: 'idle',
        });
        (useSendPasswordResetEmail as jest.Mock).mockReturnValue({
            error: null,
            isLoading: false,
            isSuccess: true,
            sendEmail: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('handles CreatePasswordModal password change and submission', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValueOnce({});
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            isSuccess: false,
            mutateAsync: mockMutateAsync,
            status: 'idle',
        });
        (useAccountStatus as jest.Mock).mockReturnValue({
            data: { is_dxtrade_password_not_set: true },
            isSuccess: true,
        });

        render(
            <ModalProvider>
                <DxtradeEnterPasswordModal />
            </ModalProvider>
        );

        expect(screen.getByText('CreatePasswordModal')).toBeInTheDocument();
        await userEvent.type(screen.getByTestId('dt_password_input'), 'NewPassword123');
        await userEvent.click(screen.getByText('Submit'));
        expect(mockMutateAsync).toHaveBeenCalledWith({
            payload: {
                account_type: 'real',
                market_type: 'all',
                password: 'NewPassword123',
                platform: 'dxtrade',
            },
        });
    });

    it('clears password on mutateAsync error', async () => {
        const mockMutateAsync = jest.fn().mockRejectedValueOnce({ error: { code: 'Error', message: 'Error message' } });
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            isSuccess: false,
            mutateAsync: mockMutateAsync,
            status: 'idle',
        });
        (useAccountStatus as jest.Mock).mockReturnValue({
            data: { is_dxtrade_password_not_set: true },
            isSuccess: true,
        });

        render(
            <ModalProvider>
                <DxtradeEnterPasswordModal />
            </ModalProvider>
        );

        await userEvent.type(screen.getByTestId('dt_password_input'), 'NewPassword123');
        await userEvent.click(screen.getByText('Submit'));
        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalled();
            expect(screen.getByTestId('dt_password_input')).toHaveValue('');
        });
    });

    it('handles EnterPasswordModal password change and button clicks', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValueOnce({});
        const mockSendEmail = jest.fn();
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            error: { error: { code: 'PasswordError' } },
            isSuccess: false,
            mutateAsync: mockMutateAsync,
            status: 'idle',
        });
        (useSendPasswordResetEmail as jest.Mock).mockReturnValue({
            sendEmail: mockSendEmail,
        });
        (useAccountStatus as jest.Mock).mockReturnValue({
            data: { is_dxtrade_password_not_set: false },
            isSuccess: true,
        });

        render(
            <ModalProvider>
                <DxtradeEnterPasswordModal />
            </ModalProvider>
        );

        expect(screen.getByText('EnterPasswordModal')).toBeInTheDocument();
        await userEvent.type(screen.getByTestId('dt_password_input'), 'NewPassword123');
        await userEvent.click(screen.getByText('Submit'));
        expect(mockMutateAsync).toHaveBeenCalledWith({
            payload: {
                account_type: 'real',
                market_type: 'all',
                password: 'NewPassword123',
                platform: 'dxtrade',
            },
        });

        await userEvent.click(screen.getByText('Forgot Password'));
        expect(mockSendEmail).toHaveBeenCalledWith({
            platform: 'dxtrade',
        });
    });

    it('handles PasswordLimitExceededModal primary and secondary button clicks', async () => {
        const mockSendEmail = jest.fn();
        (useSendPasswordResetEmail as jest.Mock).mockReturnValue({
            sendEmail: mockSendEmail,
        });
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            error: { error: { code: 'PasswordReset' } },
            status: 'error',
        });

        render(
            <ModalProvider>
                <DxtradeEnterPasswordModal />
            </ModalProvider>
        );

        expect(screen.getByText('PasswordLimitExceededModal')).toBeInTheDocument();
        await userEvent.click(screen.getByText('OK'));
        expect(mockHide).toHaveBeenCalled();

        await userEvent.click(screen.getByText('Reset Password'));
        expect(mockSendEmail).toHaveBeenCalledWith({
            platform: 'dxtrade',
        });
    });

    it('handles SuccessModal primary and secondary button clicks', async () => {
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            data: {
                account_id: 'CRW123',
            },
            isSuccess: true,
            status: 'success',
        });
        (useDxtradeAccountsList as jest.Mock).mockReturnValue({
            data: [{ display_balance: '10000', market_type: 'all' }],
            isSuccess: true,
        });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_virtual: true },
        });

        render(
            <ModalProvider>
                <DxtradeEnterPasswordModal />
            </ModalProvider>
        );

        expect(screen.getByText('SuccessModal')).toBeInTheDocument();
        await userEvent.click(screen.getByText('Transfer'));
        expect(mockHide).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/wallet/account-transfer', {
            toAccountLoginId: 'CRW123',
        });

        await userEvent.click(screen.getByText('Maybe Later'));
        expect(mockHide).toHaveBeenCalled();
    });

    it('renders WalletError on general error', () => {
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            error: { error: { code: 'Error', message: 'Error message' } },
            status: 'error',
        });

        render(
            <ModalProvider>
                <DxtradeEnterPasswordModal />
            </ModalProvider>
        );
        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('renders WalletError on reset password error', () => {
        (useSendPasswordResetEmail as jest.Mock).mockReturnValue({
            error: { error: { code: 'PasswordError', message: 'Reset password error message' } },
            isLoading: false,
            isSuccess: false,
            sendEmail: jest.fn(),
        });

        render(
            <ModalProvider>
                <DxtradeEnterPasswordModal />
            </ModalProvider>
        );
        expect(screen.getByText('Reset password error message')).toBeInTheDocument();
    });

    it('returns null when required data is not available', () => {
        (useAccountStatus as jest.Mock).mockReturnValue({
            data: undefined,
            isSuccess: false,
        });
        (useDxtradeAccountsList as jest.Mock).mockReturnValue({
            data: undefined,
            isSuccess: false,
        });
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            isSuccess: false,
            status: 'idle',
        });

        const { container } = render(
            <ModalProvider>
                <DxtradeEnterPasswordModal />
            </ModalProvider>
        );

        expect(container).toBeEmptyDOMElement();
    });
});
