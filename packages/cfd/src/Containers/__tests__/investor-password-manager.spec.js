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

jest.mock('@deriv/shared/src/utils/validation/declarative-validation-rules.js', () => ({
    getErrorMessages: jest.fn(() => ({
        password_warnings: mock_errors,
    })),
    validLength: jest.fn(() => {
        validLengthMock;
    }),
}));

const validLengthMock = (value = '', options) =>
    (options.min ? value.length >= options.min : true) && (options.max ? value.length <= options.max : true);

const mock_errors = {
    password: () => localize('Password should have lower and uppercase English letters with numbers.'),
    use_a_few_words: () => localize('Use a few words, avoid common phrases'),
    no_need_for_mixed_chars: () => localize('No need for symbols, digits, or uppercase letters'),
    uncommon_words_are_better: () => localize('Add another word or two. Uncommon words are better.'),
    straight_rows_of_keys_are_easy: () => localize('Straight rows of keys are easy to guess'),
    short_keyboard_patterns_are_easy: () => localize('Short keyboard patterns are easy to guess'),
    use_longer_keyboard_patterns: () => localize('Use a longer keyboard pattern with more turns'),
    repeated_chars_are_easy: () => localize('Repeats like "aaa" are easy to guess'),
    repeated_patterns_are_easy: () => localize('Repeats like "abcabcabc" are only slightly harder to guess than "abc"'),
    avoid_repeated_chars: () => localize('Avoid repeated words and characters'),
    sequences_are_easy: () => localize('Sequences like abc or 6543 are easy to guess'),
    avoid_sequences: () => localize('Avoid sequences'),
    recent_years_are_easy: () => localize('Recent years are easy to guess'),
    avoid_recent_years: () => localize('Avoid recent years'),
    avoid_associated_years: () => localize('Avoid years that are associated with you'),
    dates_are_easy: () => localize('Dates are often easy to guess'),
    avoid_associated_dates_and_years: () => localize('Avoid dates and years that are associated with you'),
    top10_common_password: () => localize('This is a top-10 common password'),
    top100_common_password: () => localize('This is a top-100 common password'),
    very_common_password: () => localize('This is a very common password'),
    similar_to_common_password: () => localize('This is similar to a commonly used password'),
    a_word_is_easy: () => localize('A word by itself is easy to guess'),
    names_are_easy: () => localize('Names and surnames by themselves are easy to guess'),
    common_names_are_easy: () => localize('Common names and surnames are easy to guess'),
    capitalization_doesnt_help: () => localize("Capitalization doesn't help very much"),
    all_uppercase_doesnt_help: () => localize('All-uppercase is almost as easy to guess as all-lowercase'),
    reverse_doesnt_help: () => localize("Reversed words aren't much harder to guess"),
    substitution_doesnt_help: () => localize("Predictable substitutions like '@' instead of 'a' don't help very much"),
    user_dictionary: () => localize('This password is on the blacklist'),
};

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
        await waitFor(() => {
            expect(screen.getByText(/New investor password/i)).toBeInTheDocument();
        });
    });

    it('should render the corrext texts ', async () => {
        render(<InvestorPasswordManager {...mock_props} />);
        await waitFor(() => {
            expect(screen.getByText(/New investor password/i)).toBeInTheDocument();
        });
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
        await waitFor(() => {
            expect(screen.getByText(/New investor password/i)).toBeInTheDocument();
        });
        const new_investor = screen.getByLabelText(/New investor password/i);
        const current_investor = screen.getByLabelText(/Current investor password/i);
        screen.getByText(/Change investor password/i).classList.contains('disabled');
        await waitFor(() => {
            fireEvent.change(new_investor, { target: { value: 'abcabcabc' } });
        });
        await waitFor(() => {
            expect(
                screen.getByText(/Repeats like "abcabcabc" are only slightly harder to guess than "abc"/i)
            ).toBeInTheDocument();
        });
    });

    it('should fill the password fields and trigger the appropriate error message for weak password', async () => {
        render(<InvestorPasswordManager {...mock_props} />);
        await waitFor(() => {
            expect(screen.getByText(/New investor password/i)).toBeInTheDocument();
        });
        const new_investor = screen.getByLabelText(/New investor password/i);
        screen.getByText(/Change investor password/i).classList.contains('disabled');
        await waitFor(() => {
            fireEvent.change(new_investor, { target: { value: 'aaaaa' } });
        });
        await waitFor(() => {
            expect(screen.getByText(/Repeats like "aaa" are easy to guess/i)).toBeInTheDocument();
        });
    });

    it('should fill the password fields and trigger the appropriate error message for weak password', async () => {
        render(<InvestorPasswordManager {...mock_props} />);
        await waitFor(() => {
            expect(screen.getByText(/New investor password/i)).toBeInTheDocument();
        });
        const new_investor = screen.getByLabelText(/New investor password/i);
        screen.getByText(/Change investor password/i).classList.contains('disabled');
        await waitFor(() => {
            fireEvent.change(new_investor, { target: { value: '1996' } });
        });
        await waitFor(() => {
            expect(screen.getByText(/Recent years are easy to guess/i)).toBeInTheDocument();
        });
    });

    it('should fill the password fields and trigger the appropriate error message for strong password', async () => {
        render(<InvestorPasswordManager {...mock_props} />);
        await waitFor(() => {
            expect(screen.getByText(/New investor password/i)).toBeInTheDocument();
        });
        const new_investor = screen.getByLabelText(/New investor password/i);
        screen.getByText(/Change investor password/i).classList.contains('disabled');
        await waitFor(() => {
            fireEvent.change(new_investor, { target: { value: 'Qzzxcc!lopi1' } });
        });
        await waitFor(() => {
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
        await waitFor(() => {
            expect(screen.getByText(/New investor password/i)).toBeInTheDocument();
        });
        const current_investor = screen.getByLabelText(/Current investor password/i);
        const new_investor = screen.getByLabelText(/New investor password/i);
        const change_investor_password_btn = screen.getByText(/Change investor password/i);
        screen.getByText(/Change investor password/i).classList.contains('disabled');
        await waitFor(() => {
            fireEvent.change(current_investor, { target: { value: 'Testing1234' } });
            fireEvent.change(new_investor, { target: { value: 'Qzzxcc!lopi1' } });
        });
        await waitFor(() => {
            expect(
                screen.getAllByText(
                    /Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers/i
                )[0]
            ).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(change_investor_password_btn).not.toBeDisabled();
        });
        await waitFor(() => {
            fireEvent.click(change_investor_password_btn);
        });
        await waitFor(() => {
            expect(screen.getByTestId('dt_error_message_investor')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(mockOnClick).toHaveBeenCalled();
        });
    });

    it('should render success message if the user clicks on create or reset investor passwords', async () => {
        render(<InvestorPasswordManager {...mock_props} is_submit_success_investor={true} />);
        expect(screen.getByText(/Your investor password has been changed/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /OK/i })).toBeInTheDocument();
    });
});
