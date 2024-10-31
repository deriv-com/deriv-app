import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MARKET_TYPE, PlatformDetails } from '../../../constants';
import EnterPassword from '../EnterPassword';

jest.mock('@deriv/api-v2');

describe('EnterPassword', () => {
    const mockUseActiveWalletAccount = useActiveWalletAccount as jest.Mock;

    beforeEach(() => {
        mockUseActiveWalletAccount.mockReturnValue({ data: { is_virtual: false } });
    });

    const title = `Enter your ${PlatformDetails.mt5.title} password`;
    const validPassword = 'Abcd1234!';

    const defaultProps = {
        isForgotPasswordLoading: false,
        isLoading: false,
        marketType: MARKET_TYPE.FINANCIAL,
        modalTitle: title,
        onPasswordChange: jest.fn(),
        onPrimaryClick: jest.fn(),
        onSecondaryClick: jest.fn(),
        password: '',
        passwordError: false,
        platform: PlatformDetails.mt5.platform,
        setPassword: jest.fn(),
    };

    const renderComponent = (props = {}) => {
        return render(
            <EnterPassword
                isTncChecked={true}
                onTncChange={function (): void {
                    throw new Error('Function not implemented.');
                }}
                {...defaultProps}
                {...props}
            />
        );
    };

    it('renders the component correctly', () => {
        renderComponent();
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(
            screen.getByText(
                `Enter your ${PlatformDetails.mt5.title} password to add a ${PlatformDetails.mt5.title} Financial account`
            )
        ).toBeInTheDocument();
    });

    it('calls onPasswordChange when typing in the password field', async () => {
        renderComponent();
        const passwordField = screen.getByLabelText(`${PlatformDetails.mt5.title} password`);
        await userEvent.type(passwordField, validPassword);
        expect(defaultProps.onPasswordChange).toHaveBeenCalled();
    });

    it('calls onSecondaryClick when clicking the "Forgot password?" button', async () => {
        renderComponent();
        const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot password?' });
        await userEvent.click(forgotPasswordButton);
        expect(defaultProps.onSecondaryClick).toHaveBeenCalled();
    });

    it('calls onPrimaryClick when clicking the "Add account" button', async () => {
        renderComponent({ password: validPassword });
        const addAccountButton = screen.getByRole('button', { name: 'Add account' });
        await userEvent.click(addAccountButton);
        expect(defaultProps.onPrimaryClick).toHaveBeenCalled();
    });

    it('shows password error hints when passwordError is true', () => {
        renderComponent({ passwordError: true });
        expect(
            screen.getByText(
                `Hint: You may have entered your Deriv password, which is different from your ${PlatformDetails.mt5.title} password.`
            )
        ).toBeInTheDocument();
    });
});
