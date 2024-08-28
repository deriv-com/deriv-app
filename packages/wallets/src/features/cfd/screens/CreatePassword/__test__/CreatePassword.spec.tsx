import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CFD_PLATFORMS, PlatformDetails } from '../../../constants';
import CreatePassword from '../CreatePassword';

describe('CreatePassword', () => {
    const mockOnPasswordChange = jest.fn();
    const mockOnPrimaryClick = jest.fn();

    const { title: DxtradeTitle } = PlatformDetails.dxtrade;
    const { title: MT5Title } = PlatformDetails.mt5;

    const renderComponent = (props = {}) => {
        return render(
            <CreatePassword
                isLoading={false}
                onPasswordChange={mockOnPasswordChange}
                onPrimaryClick={mockOnPrimaryClick}
                password=''
                platform={CFD_PLATFORMS.DXTRADE}
                {...props}
            />
        );
    };

    it('renders the component correctly', () => {
        renderComponent();
        expect(screen.getByText(`Create a ${DxtradeTitle} password`)).toBeInTheDocument();
        expect(
            screen.getByText(`You can use this password for all your ${DxtradeTitle} accounts.`)
        ).toBeInTheDocument();
        const button = screen.getByRole('button', { name: `Create ${DxtradeTitle} password` });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it('calls onPasswordChange when typing in the password field', async () => {
        renderComponent();
        const passwordField = screen.getByLabelText(`${DxtradeTitle} password`);
        await userEvent.type(passwordField, 'testpassword');
        expect(mockOnPasswordChange).toHaveBeenCalledTimes(12); // 'testpassword' has 12 characters
    });

    it('calls onPrimaryClick when the button is clicked', async () => {
        const validPassword = 'Abcd1234';
        renderComponent({ password: validPassword });
        const button = screen.getByRole('button', { name: `Create ${DxtradeTitle} password` });
        await userEvent.click(button);
        expect(mockOnPrimaryClick).toHaveBeenCalled();
    });

    it('disables the button when the password is invalid or loading', () => {
        const shortPassword = 'Abcd';
        renderComponent({ password: shortPassword });
        const button = screen.getByRole('button', { name: `Create ${DxtradeTitle} password` });
        expect(button).toBeDisabled();

        renderComponent({ isLoading: true });
        expect(button).toBeDisabled();
    });

    it('renders correctly for MT5 platform', () => {
        renderComponent({ platform: CFD_PLATFORMS.MT5 });
        expect(screen.getByText(`Create a ${MT5Title} password`)).toBeInTheDocument();
        expect(screen.getByText(`You can use this password for all your ${MT5Title} accounts.`)).toBeInTheDocument();
        expect(screen.getByLabelText(`${MT5Title} password`)).toBeInTheDocument();
    });
});
