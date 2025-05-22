import React from 'react';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModal } from '../../../../../../components/ModalProvider';
import MT5ChangeInvestorPasswordScreens from '../MT5ChangeInvestorPasswordScreens';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useSettings: jest.fn(),
    useVerifyEmail: jest.fn(),
}));

jest.mock('../../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../../components/ModalProvider'),
    useModal: jest.fn(),
}));

jest.mock('../MT5ChangeInvestorPasswordInputsScreen', () =>
    jest.fn(({ sendEmail }) => (
        <div>
            <button onClick={sendEmail}>Send Email</button>
        </div>
    ))
);

describe('MT5ChangeInvestorPasswordScreens', () => {
    const mockMutate = jest.fn();
    const mockSetShowEmailSentScreen = jest.fn();

    beforeEach(() => {
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn().mockReturnValue('account-id'),
            hide: jest.fn(),
        });
        (useSettings as jest.Mock).mockReturnValue({ data: { email: 'user@example.com' } });
        (useVerifyEmail as jest.Mock).mockReturnValue({ mutate: mockMutate });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false } });
    });

    afterEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('renders default content', () => {
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn().mockReturnValue(null),
            hide: jest.fn(),
        });
        render(<MT5ChangeInvestorPasswordScreens />);

        expect(screen.getByRole('button', { name: 'Send Email' })).toBeInTheDocument();
    });

    it('handles send email button click', async () => {
        render(<MT5ChangeInvestorPasswordScreens setShowEmailSentScreen={mockSetShowEmailSentScreen} />);

        await userEvent.click(screen.getByRole('button', { name: 'Send Email' }));

        expect(mockMutate).toHaveBeenCalled();
        expect(mockSetShowEmailSentScreen).toHaveBeenCalledWith(true);
        expect(localStorage.getItem('trading_platform_investor_password_reset_account_id')).toBe('account-id');
    });

    it('does not call mutate or set localStorage when email is not available', async () => {
        (useSettings as jest.Mock).mockReturnValue({ data: { email: undefined } });
        render(<MT5ChangeInvestorPasswordScreens setShowEmailSentScreen={mockSetShowEmailSentScreen} />);

        await userEvent.click(screen.getByRole('button', { name: 'Send Email' }));

        expect(mockMutate).not.toHaveBeenCalled();
        expect(mockSetShowEmailSentScreen).toHaveBeenCalledWith(true);
        expect(localStorage.getItem('trading_platform_investor_password_reset_account_id')).toBeNull();
    });
});
