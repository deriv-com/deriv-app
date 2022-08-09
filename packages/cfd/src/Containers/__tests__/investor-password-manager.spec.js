import React from 'react';
import { screen, render, waitFor, fireEvent, act } from '@testing-library/react';
import InvestorPasswordManager from '../investor-password-manager';
import { localize } from '@deriv/translations';

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    WS: {
        verifyEmail: jest.fn(() => Promise.resolve()),
    },
}));

const validLengthMock = (value = '', options) =>
    (options.min ? value.length >= options.min : true) && (options.max ? value.length <= options.max : true);

const mock_errors = {
    password: () => localize('Password should have lower and uppercase English letters with numbers.'),
    repeated_chars_are_easy: () => localize('Repeats like "aaa" are easy to guess'),
    repeated_patterns_are_easy: () => localize('Repeats like "abcabcabc" are only slightly harder to guess than "abc"'),
    recent_years_are_easy: () => localize('Recent years are easy to guess'),
};

jest.mock('@deriv/shared/src/utils/validation/declarative-validation-rules.js', () => ({
    getErrorMessages: jest.fn(() => ({
        password_warnings: mock_errors,
    })),
    validLength: jest.fn(() => {
        validLengthMock;
    }),
}));

describe('should render investor ', () => {
    const mock_props = {
        error_message_investor: 'Forgot your password? Please reset your password.',
        is_submit_success_investor: false,
        multi_step_ref: { current: { nextStep: jest.fn() } },
        onSubmit: jest.fn(),
        setPasswordType: jest.fn(() => 'investor'),
        toggleModal: jest.fn(),
        validatePassword: jest.fn(),
    };

    it('should render investor password manager', async () => {
        render(<InvestorPasswordManager {...mock_props} />);

        expect(await screen.findByText(/New investor password/i)).toBeInTheDocument();
    });

    it('should render the corrext texts ', async () => {
        render(<InvestorPasswordManager {...mock_props} />);
        expect(await screen.findByText(/New investor password/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /Use this password to grant viewing access to another user. While they may view your trading account, they will not be able to trade or take any other actions/i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /If this is the first time you try to create a password, or you have forgotten your password, please reset it/i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/Current investor password/i)).toBeInTheDocument();
        expect(screen.getByText(/New investor password/i)).toBeInTheDocument();
    });

    it('should fill the password fields and trigger the appropriate error message for weak password', async () => {
        render(<InvestorPasswordManager {...mock_props} />);
        expect(await screen.findByText(/New investor password/i)).toBeInTheDocument();
        const new_investor = screen.getByLabelText(/New investor password/i);
        screen.getByText(/Change investor password/i).classList.contains('disabled');
        await waitFor(() => {
            fireEvent.change(new_investor, { target: { value: 'abcabcabc' } });
        });
        expect(
            await screen.findByText(/Repeats like "abcabcabc" are only slightly harder to guess than "abc"/i)
        ).toBeInTheDocument();
    });

    it('should fill the password fields and trigger the appropriate error message for weak password', async () => {
        render(<InvestorPasswordManager {...mock_props} />);
        expect(await screen.findByText(/New investor password/i)).toBeInTheDocument();
        const new_investor = screen.getByLabelText(/New investor password/i);
        screen.getByText(/Change investor password/i).classList.contains('disabled');
        await waitFor(() => {
            fireEvent.change(new_investor, { target: { value: 'aaaaa' } });
        });
        expect(await screen.findByText(/Repeats like "aaa" are easy to guess/i)).toBeInTheDocument();
    });

    it('should fill the password fields and trigger the appropriate error message for weak password', async () => {
        render(<InvestorPasswordManager {...mock_props} />);
        expect(await screen.findByText(/New investor password/i)).toBeInTheDocument();
        const new_investor = screen.getByLabelText(/New investor password/i);
        screen.getByText(/Change investor password/i).classList.contains('disabled');
        await waitFor(() => {
            fireEvent.change(new_investor, { target: { value: '1996' } });
        });

        expect(await screen.findByText(/Recent years are easy to guess/i)).toBeInTheDocument();
    });

    it('should fill the password fields and trigger the appropriate error message for strong password', async () => {
        render(<InvestorPasswordManager {...mock_props} />);
        expect(await screen.findByText(/New investor password/i)).toBeInTheDocument();
        const new_investor = screen.getByLabelText(/New investor password/i);
        screen.getByText(/Change investor password/i).classList.contains('disabled');
        await waitFor(() => {
            fireEvent.change(new_investor, { target: { value: 'Qzzxcc!lopi1' } });
            expect(
                screen.getAllByText(
                    /Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers/i
                )[0]
            ).toBeInTheDocument();
        });
    });

    it('should fill the password fields and trigger the appropriate error message for strong password', async () => {
        const mockOnClick = jest.fn();
        render(<InvestorPasswordManager {...mock_props} onClick={mockOnClick()} />);
        expect(await screen.findByText(/New investor password/i)).toBeInTheDocument();
        const current_investor = screen.getByLabelText(/Current investor password/i);
        const new_investor = screen.getByLabelText(/New investor password/i);
        const change_investor_password_btn = screen.getByText(/Change investor password/i);
        screen.getByText(/Change investor password/i).classList.contains('disabled');
        await waitFor(() => {
            fireEvent.change(current_investor, { target: { value: 'Testing1234' } });
            fireEvent.change(new_investor, { target: { value: 'Qzzxcc!lopi1' } });
            expect(
                screen.getAllByText(
                    /Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers/i
                )[0]
            ).toBeInTheDocument();
            expect(change_investor_password_btn).not.toBeDisabled();
            fireEvent.click(change_investor_password_btn);
            expect(screen.getByTestId('dt_error_message_investor')).toBeInTheDocument();
            expect(mockOnClick).toHaveBeenCalled();
        });
    });

    it('should render success message if the user clicks on create or reset investor passwords', async () => {
        render(<InvestorPasswordManager {...mock_props} is_submit_success_investor={true} />);
        expect(screen.getByText(/Your investor password has been changed/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /OK/i })).toBeInTheDocument();
    });
});
