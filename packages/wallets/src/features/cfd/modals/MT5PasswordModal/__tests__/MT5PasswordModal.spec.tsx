import React from 'react';
import {
    useAccountStatus,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useTradingPlatformPasswordChange,
    useVerifyEmail,
} from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModal } from '../../../../../components/ModalProvider';
import MT5PasswordModal from '../MT5PasswordModal';

jest.mock('@deriv/api-v2');
jest.mock('../../../../../components/ModalProvider');
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loading...</div>),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('../../../../../components/Base', () => ({
    ModalStepWrapper: ({
        children,
        renderFooter,
        title,
    }: {
        children: React.ReactNode;
        renderFooter?: () => React.ReactNode;
        title?: string;
    }) => (
        <div>
            {title && <div data-testid='dt_modal_title'>{title}</div>}
            {children}
            {renderFooter && <div data-testid='dt_modal_footer'>{renderFooter()}</div>}
        </div>
    ),
    ModalWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../../../components', () => ({
    SentEmailContent: () => <div>SentEmailContent</div>,
    WalletError: () => <div>WalletError</div>,
}));

jest.mock('../../../screens', () => ({
    CreatePassword: ({
        onPasswordChange,
        onPrimaryClick,
    }: {
        onPasswordChange: () => void;
        onPrimaryClick: () => void;
    }) => (
        <div>
            CreatePassword
            <input data-testid='dt_create_password_input' onChange={onPasswordChange} />
            <button data-testid='dt_create_password_primary_button' onClick={onPrimaryClick}>
                Primary
            </button>
        </div>
    ),
    CreatePasswordMT5: ({
        onPasswordChange,
        onPrimaryClick,
        onTncChange,
    }: {
        onPasswordChange: () => void;
        onPrimaryClick: () => void;
        onTncChange: () => void;
    }) => (
        <div>
            CreatePasswordMT5
            <input data-testid='dt_create_password_mt5_input' onChange={onPasswordChange} />
            <input data-testid='dt_create_password_mt5_tnc' onChange={onTncChange} type='checkbox' />
            <button data-testid='dt_create_password_mt5_primary_button' onClick={onPrimaryClick}>
                Primary
            </button>
        </div>
    ),
    EnterPassword: ({
        onPasswordChange,
        onPrimaryClick,
        onSecondaryClick,
        onTncChange,
    }: {
        onPasswordChange: () => void;
        onPrimaryClick: () => void;
        onSecondaryClick: () => void;
        onTncChange: () => void;
    }) => (
        <div>
            EnterPassword
            <input data-testid='dt_enter_password_input' onChange={onPasswordChange} />
            <input data-testid='dt_enter_password_tnc' onChange={onTncChange} type='checkbox' />
            <button data-testid='dt_enter_password_primary_button' onClick={onPrimaryClick}>
                Primary
            </button>
            <button data-testid='dt_enter_password_secondary_button' onClick={onSecondaryClick}>
                Secondary
            </button>
        </div>
    ),
    MT5ResetPasswordModal: ({
        onClickSubmitPasswordChange,
        sendEmailVerification,
    }: {
        onClickSubmitPasswordChange: ({
            currentPassword,
            newPassword,
        }: {
            currentPassword: string;
            newPassword: string;
        }) => void;
        sendEmailVerification: () => void;
    }) => (
        <div>
            MT5ResetPasswordModal
            <button
                data-testid='dt_mt5_reset_password_modal_primary_button'
                onClick={() => onClickSubmitPasswordChange({ currentPassword: 'oldPass', newPassword: 'newPass' })}
            >
                Submit Password Change
            </button>
            <button data-testid='dt_mt5_reset_password_modal_secondary_button' onClick={sendEmailVerification}>
                Send Email Verification
            </button>
        </div>
    ),
}));

jest.mock('../../MT5AccountAdded', () => ({
    MT5AccountAdded: () => <div>MT5AccountAdded</div>,
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
            <button data-testid='dt_password_limit_exceeded_modal_primary_button' onClick={onPrimaryClick}>
                Primary
            </button>
            <button data-testid='dt_password_limit_exceeded_modal_secondary_button' onClick={onSecondaryClick}>
                Secondary
            </button>
        </div>
    ),
}));

jest.mock('../MT5PasswordModalFooters', () => ({
    MT5PasswordModalFooter: ({
        onPrimaryClick,
        onSecondaryClick,
    }: {
        onPrimaryClick: () => void;
        onSecondaryClick: () => void;
    }) => (
        <div>
            MT5PasswordModalFooter
            <button data-testid='dt_mt5_password_modal_footer_primary_button' onClick={onPrimaryClick}>
                Primary
            </button>
            <button data-testid='dt_mt5_password_modal_footer_secondary_button' onClick={onSecondaryClick}>
                Secondary
            </button>
        </div>
    ),
    SuccessModalFooter: () => <div>SuccessModalFooter</div>,
}));

describe('MT5PasswordModal', () => {
    const mockTradingPasswordChangeMutateAsync = jest.fn();
    const mockEmailVerificationMutate = jest.fn();
    const mockCreateMT5AccountMutate = jest.fn();

    const mockAccount = {
        market_type: 'synthetic',
        platform: 'mt5',
        product: 'financial',
    };

    const mockCtraderAccount = {
        market_type: 'all',
        platform: 'ctrader',
    };

    beforeEach(() => {
        (useCreateMT5Account as jest.Mock).mockReturnValue({ error: undefined, mutate: jest.fn(), status: 'idle' });
        (useTradingPlatformPasswordChange as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: undefined, isLoading: false });
        (useModal as jest.Mock).mockReturnValue({ getModalState: jest.fn(), hide: jest.fn() });
        (useVerifyEmail as jest.Mock).mockReturnValue({ error: undefined, status: 'idle' });
        (useSettings as jest.Mock).mockReturnValue({ data: { email: undefined } });
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: [{ market_type: 'synthetic', product: 'standard', shortcode: 'bvi' }],
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [{ login: '12345', market_type: 'financial' }],
        });
    });

    it('renders loader if isLoading is true', () => {
        (useAccountStatus as jest.Mock).mockReturnValue({ isLoading: true });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders EnterPassword by default for desktop view', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('EnterPassword')).toBeInTheDocument();
    });

    it('renders EnterPassword by default with title and footer for mobile view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('EnterPassword')).toBeInTheDocument();
        expect(screen.getByText('MT5PasswordModalFooter')).toBeInTheDocument();
        expect(screen.getByText('Add an MT5 Standard account')).toBeInTheDocument();
    });

    it('renders default content for demo account', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} isVirtual />);

        expect(screen.getByText('EnterPassword')).toBeInTheDocument();
        expect(screen.getByText('MT5PasswordModalFooter')).toBeInTheDocument();
        expect(screen.getByText('Add an MT5 Standard demo account')).toBeInTheDocument();
    });

    it('renders WalletError for account creation errors', () => {
        (useCreateMT5Account as jest.Mock).mockReturnValue({
            error: { error: { code: 'Error', message: 'Error message' } },
            status: 'error',
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('WalletError')).toBeInTheDocument();
    });

    it('renders WalletError when email verification fails', () => {
        (useVerifyEmail as jest.Mock).mockReturnValue({
            error: { error: { message: 'Error' } },
            status: 'error',
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('WalletError')).toBeInTheDocument();
    });

    it('renders SentEmailContent when email verification succeeds', () => {
        (useVerifyEmail as jest.Mock).mockReturnValue({ status: 'success' });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('SentEmailContent')).toBeInTheDocument();
    });

    it('handles primary and secondary button clicks in EnterPassword', async () => {
        (useCreateMT5Account as jest.Mock).mockReturnValue({ mutate: mockCreateMT5AccountMutate, status: 'idle' });
        (useVerifyEmail as jest.Mock).mockReturnValue({
            mutate: mockEmailVerificationMutate,
            status: 'idle',
        });
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                address_city: 'city',
                address_line_1: 'address',
                address_postcode: 'postcode',
                address_state: 'state',
                country_code: 'country',
                email: 'test@example.com',
                first_name: 'first_name',
                phone: 'phone',
            },
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        const passwordInput = screen.getByTestId('dt_enter_password_input');
        const tncCheckbox = screen.getByTestId('dt_enter_password_tnc');
        await userEvent.type(passwordInput, 'test123');
        await userEvent.click(tncCheckbox);
        await userEvent.click(screen.getByTestId('dt_enter_password_primary_button'));
        expect(mockCreateMT5AccountMutate).toHaveBeenCalledWith({
            payload: {
                account_type: 'gaming',
                address: 'address',
                city: 'city',
                country: 'country',
                email: 'test@example.com',
                leverage: 500,
                mainPassword: 'test123',
                name: 'first_name',
                phone: 'phone',
                state: 'state',
                zipCode: 'postcode',
            },
        });

        await userEvent.click(screen.getByTestId('dt_enter_password_secondary_button'));
        expect(mockEmailVerificationMutate).toHaveBeenCalledWith({
            type: 'trading_platform_mt5_password_reset',
            url_parameters: {
                redirect_to: 10,
            },
            verify_email: 'test@example.com',
        });
    });

    it('renders CreatePassword when MT5 password is not set', () => {
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_mt5_password_not_set: true }, isLoading: false });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('CreatePasswordMT5')).toBeInTheDocument();
    });

    it('renders CreatePassword with correct button text when MT5 password is not set for mobile view', () => {
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_mt5_password_not_set: true }, isLoading: false });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('Create Deriv MT5 password')).toBeInTheDocument();
    });

    it('handles primary button click for CreatePassword', async () => {
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_mt5_password_not_set: true }, isLoading: false });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        (useTradingPlatformPasswordChange as jest.Mock).mockReturnValue({
            mutateAsync: mockTradingPasswordChangeMutateAsync,
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockCtraderAccount} />);

        const input = screen.getByTestId('dt_create_password_input');
        await userEvent.type(input, 'test123');
        await userEvent.click(screen.getByTestId('dt_create_password_primary_button'));
        expect(mockTradingPasswordChangeMutateAsync).toHaveBeenCalledWith({
            new_password: 'test123',
            platform: 'mt5',
        });
    });

    it('renders CreatePasswordMT5 when MT5 password is not set and platform is MT5', () => {
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_mt5_password_not_set: true }, isLoading: false });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('CreatePasswordMT5')).toBeInTheDocument();
    });

    it('handles primary button click for CreatePasswordMT5', async () => {
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_mt5_password_not_set: true }, isLoading: false });
        (useTradingPlatformPasswordChange as jest.Mock).mockReturnValue({
            mutateAsync: mockTradingPasswordChangeMutateAsync,
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        const passwordInput = screen.getByTestId('dt_create_password_mt5_input');
        const tncCheckbox = screen.getByTestId('dt_create_password_mt5_tnc');
        await userEvent.type(passwordInput, 'test123');
        await userEvent.click(tncCheckbox);
        await userEvent.click(screen.getByTestId('dt_create_password_mt5_primary_button'));
        expect(mockTradingPasswordChangeMutateAsync).toHaveBeenCalledWith({
            new_password: 'test123',
            platform: 'mt5',
        });
    });

    it('renders MT5ResetPasswordModal when password update is required', () => {
        (useCreateMT5Account as jest.Mock).mockReturnValue({
            error: { error: { code: 'InvalidTradingPlatformPasswordFormat' } },
            status: 'error',
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('MT5ResetPasswordModal')).toBeInTheDocument();
    });

    it('renders MT5ResetPasswordModal with correct title when password update is required for mobile view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        (useCreateMT5Account as jest.Mock).mockReturnValue({
            error: { error: { code: 'InvalidTradingPlatformPasswordFormat' } },
            status: 'error',
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('MT5ResetPasswordModal')).toBeInTheDocument();
        expect(screen.getByText('Deriv MT5 latest password requirements')).toBeInTheDocument();
    });

    it('handles primary and secondary button clicks for MT5ResetPasswordModal', async () => {
        (useSettings as jest.Mock).mockReturnValue({ data: { email: 'test@example.com' } });
        (useCreateMT5Account as jest.Mock).mockReturnValue({
            error: { error: { code: 'InvalidTradingPlatformPasswordFormat' } },
            status: 'error',
        });
        (useTradingPlatformPasswordChange as jest.Mock).mockReturnValue({
            mutateAsync: mockTradingPasswordChangeMutateAsync,
        });
        (useVerifyEmail as jest.Mock).mockReturnValue({
            mutate: mockEmailVerificationMutate,
            status: 'idle',
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        await userEvent.click(screen.getByTestId('dt_mt5_reset_password_modal_primary_button'));
        expect(mockTradingPasswordChangeMutateAsync).toHaveBeenCalledWith({
            new_password: 'newPass',
            old_password: 'oldPass',
            platform: 'mt5',
        });

        await userEvent.click(screen.getByTestId('dt_mt5_reset_password_modal_secondary_button'));
        expect(mockEmailVerificationMutate).toHaveBeenCalledWith({
            type: 'trading_platform_mt5_password_reset',
            url_parameters: {
                redirect_to: 10,
            },
            verify_email: 'test@example.com',
        });
    });

    it('renders MT5AccountAdded when account creation succeeds', () => {
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_mt5_password_not_set: false }, isLoading: false });
        (useCreateMT5Account as jest.Mock).mockReturnValue({
            isSuccess: true,
            status: 'success',
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('MT5AccountAdded')).toBeInTheDocument();
    });

    it('renders PasswordLimitExceededModal when password reset is required', () => {
        (useCreateMT5Account as jest.Mock).mockReturnValue({
            error: { error: { code: 'PasswordReset' } },
            status: 'error',
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        expect(screen.getByText('PasswordLimitExceededModal')).toBeInTheDocument();
    });

    it('handles primary button click for PasswordLimitExceededModal', async () => {
        (useSettings as jest.Mock).mockReturnValue({ data: { email: 'test@example.com' } });
        (useCreateMT5Account as jest.Mock).mockReturnValue({
            error: { error: { code: 'PasswordReset' } },
            status: 'error',
        });
        (useVerifyEmail as jest.Mock).mockReturnValue({
            mutate: mockEmailVerificationMutate,
            status: 'idle',
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        await userEvent.click(screen.getByTestId('dt_password_limit_exceeded_modal_secondary_button'));
        expect(mockEmailVerificationMutate).toHaveBeenCalledWith({
            type: 'trading_platform_mt5_password_reset',
            url_parameters: {
                redirect_to: 10,
            },
            verify_email: 'test@example.com',
        });
    });

    it('handles secondary button click for MT5PasswordModalFooter', async () => {
        (useSettings as jest.Mock).mockReturnValue({ data: { email: 'test@example.com' } });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        (useVerifyEmail as jest.Mock).mockReturnValue({
            mutate: mockEmailVerificationMutate,
            status: 'idle',
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} />);

        await userEvent.click(screen.getByTestId('dt_mt5_password_modal_footer_secondary_button'));
        expect(mockEmailVerificationMutate).toHaveBeenCalledWith({
            type: 'trading_platform_mt5_password_reset',
            url_parameters: {
                redirect_to: 10,
            },
            verify_email: 'test@example.com',
        });
    });

    it('sends create MT5 account request with correct parameters for demo account', async () => {
        (useCreateMT5Account as jest.Mock).mockReturnValue({ mutate: mockCreateMT5AccountMutate, status: 'idle' });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                address_city: 'city',
                address_line_1: 'address',
                address_postcode: 'postcode',
                address_state: 'state',
                country_code: 'country',
                email: 'test@example.com',
                first_name: 'first_name',
                phone: 'phone',
            },
        });

        //@ts-expect-error since this is a mock, we only need partial properties of the account
        render(<MT5PasswordModal account={mockAccount} isVirtual />);

        await userEvent.click(screen.getByTestId('dt_enter_password_primary_button'));
        expect(mockCreateMT5AccountMutate).toHaveBeenCalledWith({
            payload: {
                account_type: 'demo',
                address: 'address',
                city: 'city',
                country: 'country',
                email: 'test@example.com',
                leverage: 500,
                mainPassword: '',
                name: 'first_name',
                phone: 'phone',
                state: 'state',
                zipCode: 'postcode',
            },
        });
    });
});
