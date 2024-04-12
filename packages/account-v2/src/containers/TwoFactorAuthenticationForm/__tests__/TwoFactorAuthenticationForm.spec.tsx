import React from 'react';
import { Formik } from 'formik';
import { APIProvider, AuthProvider, useTwoFactorAuthentication, useTwoFactorAuthenticationStatus } from '@deriv/api-v2';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TwoFactorAuthenticationForm } from '../TwoFactorAuthenticationForm';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useTwoFactorAuthentication: jest.fn(),
    useTwoFactorAuthenticationStatus: jest.fn(),
}));

const renderComponent = () => {
    return render(
        <Formik initialValues={{}} onSubmit={jest.fn()}>
            <TwoFactorAuthenticationForm />
        </Formik>,
        { wrapper }
    );
};

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

const mockUseTwoFactorAuthentication = useTwoFactorAuthentication as jest.MockedFunction<
    typeof useTwoFactorAuthentication
>;
const mockUseTwoFactorAuthenticationStatus = useTwoFactorAuthenticationStatus as jest.MockedFunction<
    typeof useTwoFactorAuthenticationStatus
>;

describe('TwoFactorAuthenticationForm', () => {
    const inputLabel = 'Authentication code';
    it('should render the TwoFactorAuthenticationForm component', () => {
        (mockUseTwoFactorAuthentication as jest.Mock).mockReturnValueOnce({
            isLoading: false,
        });
        (mockUseTwoFactorAuthenticationStatus as jest.Mock).mockReturnValueOnce({
            data: true,
        });
        renderComponent();
        expect(screen.getByLabelText(inputLabel)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Disable' })).toBeInTheDocument();
    });
    it('should display an error if an invalid code is provided', () => {
        (mockUseTwoFactorAuthentication as jest.Mock).mockReturnValueOnce({
            error: { error: { code: 'InvalidOTP' } },
            isLoading: false,
        });
        (mockUseTwoFactorAuthenticationStatus as jest.Mock).mockReturnValueOnce({
            data: true,
        });
        renderComponent();
        const input = screen.getByLabelText(inputLabel);
        const button = screen.getByRole('button', { name: 'Disable' });
        userEvent.type(input, '123');
        userEvent.click(button);
        userEvent.tab();
        expect(screen.getByText("That's not the right code. Please try again.")).toBeInTheDocument();
    });
    it('should handle submit when the form button is clicked and two factor authentication is disabled', async () => {
        const otp = '123456';
        const mockMutate = jest.fn();
        (mockUseTwoFactorAuthentication as jest.Mock).mockReturnValueOnce({
            isLoading: false,
            mutate: mockMutate,
        });
        (mockUseTwoFactorAuthenticationStatus as jest.Mock).mockReturnValueOnce({
            data: false,
            isLoading: false,
        });
        renderComponent();
        const input = screen.getByLabelText(inputLabel);
        const button = screen.getByRole('button', { name: 'Enable' });
        userEvent.type(input, otp);
        const input2 = screen.getByDisplayValue(otp);
        expect(input2).toBeInTheDocument();
        await act(async () => {
            await userEvent.click(button);
        });
        expect(mockMutate).toHaveBeenCalledWith({ otp, totp_action: 'enable' });
    });
    it('should handle submit when the form button is clicked and two factor authentication is enabled', async () => {
        const otp = '123456';
        const mockMutate = jest.fn();
        (mockUseTwoFactorAuthentication as jest.Mock).mockReturnValueOnce({
            isLoading: false,
            mutate: mockMutate,
        });
        (mockUseTwoFactorAuthenticationStatus as jest.Mock).mockReturnValueOnce({
            data: true,
            isLoading: false,
        });
        renderComponent();
        const input = screen.getByLabelText(inputLabel);
        const button = screen.getByRole('button', { name: 'Disable' });
        userEvent.type(input, otp);
        const input2 = screen.getByDisplayValue(otp);
        expect(input2).toBeInTheDocument();
        await act(async () => {
            await userEvent.click(button);
        });
        expect(mockMutate).toHaveBeenCalledWith({ otp, totp_action: 'disable' });
    });
});
