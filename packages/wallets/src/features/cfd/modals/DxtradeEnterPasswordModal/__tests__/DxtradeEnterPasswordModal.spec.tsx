import React from 'react';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useCreateOtherCFDAccount,
    useDxtradeAccountsList,
} from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../../../components/ModalProvider';
import useSendPasswordResetEmail from '../../../../../hooks/useSendPasswordResetEmail';
import DxtradeEnterPasswordModal from '../DxtradeEnterPasswordModal';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: jest.fn(),
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
    })),
}));

jest.mock('../../CreatePasswordModal', () => ({
    CreatePasswordModal: ({
        onPasswordChange,
        onPrimaryClick,
    }: {
        onPasswordChange: () => void;
        onPrimaryClick: () => void;
    }) => (
        <div>
            CreatePasswordModal
            <input data-testid='password-input' onChange={onPasswordChange} />
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
            <input data-testid='password-input' onChange={onPasswordChange} />
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
            data: { is_virtual: false },
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
            isSuccess: false,
            sendEmail: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders CreatePasswordModal when password is not set', () => {
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
    });

    it('renders EnterPasswordModal when password is set', () => {
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
    });

    it('renders PasswordLimitExceededModal on password reset error', () => {
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
    });

    it('renders SuccessModal on successful account creation', () => {
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
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
});
