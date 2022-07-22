import React from 'react';
import { screen, render, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import CFDPasswordManagerModal from '../cfd-password-manager-modal';
import { BrowserRouter } from 'react-router-dom';
import { localize } from '@deriv/translations';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div data-testid='mocked_icon'>{props.icon}</div>),
    };
});

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    WS: {
        verifyEmail: jest.fn(() => Promise.resolve()),
    },
}));

jest.mock('@deriv/shared/src/utils/validation/declarative-validation-rules.js', () => {
    const original_module = jest.requireActual('@deriv/shared/src/utils/validation/declarative-validation-rules.js');
    return {
        ...original_module,
        validPassword: jest.fn(() => {
            validPasswordMock;
        }),
        validLength: jest.fn(() => {
            validLengthMock;
        }),
        getErrorMessages: jest.fn(() => ({
            password_warnings: mock_errors,
        })),
    };
});

const validPasswordMock = value => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+/.test(value);

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

describe('<CFDPasswordManagerModal />', () => {
    const renderwithRouter = component => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };
    let modal_root_el;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    afterEach(cleanup);

    const mock_props = {
        enableApp: jest.fn(),
        email: 'test@domain.com',
        disableApp: jest.fn(),
        is_visible: true,
        platform: 'mt5',
        selected_login: 'MTD20103241',
        selected_account: 'Synthetic',
        toggleModal: jest.fn(),
        selected_account_type: 'financial',
        selected_account_group: 'demo',
        selected_server: 'p01_ts03',
        sendVerifyEmail: jest.fn(),
    };

    it('should render the DMT5 password modal', () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        expect(screen.getByText(/Manage DMT5 password/i)).toBeInTheDocument();
        expect(screen.getAllByText(/DMT5 password/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/IcMt5OnePassword/i)).toBeInTheDocument();
        expect(screen.getAllByText(/DMT5 password/i)[1]).toBeInTheDocument();
        expect(screen.getByText(/Investor password/i)).toBeInTheDocument();
        expect(screen.getAllByText(/DMT5 password/i)[2]).toBeInTheDocument();
        expect(
            screen.getByText(/Use this password to log in to your DMT5 accounts on the desktop, web, and mobile apps/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change DMT5 password/i })).toBeInTheDocument();
    });

    it('should render change-password-confirmation-modal if Change DMT5 password button is clicked', () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        fireEvent.click(screen.getByRole('button', { name: /Change DMT5 password/i }));
        expect(screen.getByText(/Confirm to change your DMT5 password/i)).toBeInTheDocument();
        expect(screen.getByText(/This will change the password to all of your DMT5 accounts/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
    });

    it('should render SentEmailModal if confirm button is clicked', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        fireEvent.click(screen.getByRole('button', { name: /Change DMT5 password/i }));
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => expect(screen.getByText(/We've sent you an email/i)).toBeInTheDocument());
        await waitFor(() =>
            expect(
                screen.getByText(/Please click on the link in the email to change your DMT5 password./i)
            ).toBeInTheDocument()
        );
        await waitFor(() => expect(screen.getByText(/Didn't receive the email?/i)).toBeInTheDocument());
    });

    it('should render the password modal for Deriv X', () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        expect(screen.getByText(/Manage Deriv X password/i)).toBeInTheDocument();
        expect(screen.getByText(/IcDxtradeOnePassword/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Deriv X password/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/Use this password to log in to your Deriv X accounts on the web and mobile apps/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change Deriv X password/i })).toBeInTheDocument();
    });

    it('should render change password confirmation if change Deriv X button is clicked', () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /Change Deriv X password/i }));
        expect(screen.getByText(/Confirm to change your Deriv X password/i)).toBeInTheDocument();
        expect(screen.getByText(/This will change the password to all of your Deriv X accounts/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
    });

    it('should render SentEmailModal if confirm button is clicked for Deriv X', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /Change Deriv X password/i }));
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => expect(screen.getByText(/We've sent you an email/i)).toBeInTheDocument());
        await waitFor(() =>
            expect(
                screen.getByText(/Please click on the link in the email to change your Deriv X password./i)
            ).toBeInTheDocument()
        );
        await waitFor(() => expect(screen.getByText(/Didn't receive the email?/i)).toBeInTheDocument());
    });

    it('should render the resend email button if the user clicks Didnt receive the email', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /Change Deriv X password/i }));
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => expect(screen.getByText(/We've sent you an email/i)).toBeInTheDocument());
        await waitFor(() =>
            expect(
                screen.getByText(/Please click on the link in the email to change your Deriv X password./i)
            ).toBeInTheDocument()
        );
        await waitFor(() => expect(screen.getByText(/Didn't receive the email?/i)).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /Didn't receive the email?/i }));
        await waitFor(() => expect(screen.getByRole('button', { name: /Resend email/i })).toBeInTheDocument());
    });

    it('should start the countdown if the user clicks on resend email', async () => {
        jest.useFakeTimers();
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /Change Deriv X password/i }));
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => expect(screen.getByText(/We've sent you an email/i)).toBeInTheDocument());
        await waitFor(() =>
            expect(
                screen.getByText(/Please click on the link in the email to change your Deriv X password./i)
            ).toBeInTheDocument()
        );
        await waitFor(() => expect(screen.getByText(/Didn't receive the email?/i)).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /Didn't receive the email?/i }));
        await waitFor(() => expect(screen.getByRole('button', { name: /Resend email/i })).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /Resend email/i }));
        act(() => {
            jest.advanceTimersByTime(1500);
        });
        expect(screen.getByText(/Resend email in 59/i)).toBeInTheDocument();
    });

    it('should disable the button for 60 seconds after clickng resend email', async () => {
        jest.useFakeTimers();
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /Change Deriv X password/i }));
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => expect(screen.getByText(/We've sent you an email/i)).toBeInTheDocument());
        await waitFor(() =>
            expect(
                screen.getByText(/Please click on the link in the email to change your Deriv X password./i)
            ).toBeInTheDocument()
        );
        await waitFor(() => expect(screen.getByText(/Didn't receive the email?/i)).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /Didn't receive the email?/i }));
        await waitFor(() => expect(screen.getByRole('button', { name: /Resend email/i })).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /Resend email/i }));
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(screen.getByRole('button', { name: /Resend email in 59/i })).toBeDisabled();
    });

    it('should enable back the resend email button after 60 seconds', async () => {
        jest.useFakeTimers();
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /Change Deriv X password/i }));
        fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
        await waitFor(() => expect(screen.getByText(/We've sent you an email/i)).toBeInTheDocument());
        await waitFor(() =>
            expect(
                screen.getByText(/Please click on the link in the email to change your Deriv X password./i)
            ).toBeInTheDocument()
        );
        await waitFor(() => expect(screen.getByText(/Didn't receive the email?/i)).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /Didn't receive the email?/i }));
        await waitFor(() => expect(screen.getByRole('button', { name: /Resend email/i })).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /Resend email/i }));
        act(() => {
            jest.advanceTimersByTime(60000);
        });
        expect(screen.getByRole('button', { name: /Resend email/i })).toBeEnabled();
    });

    it('should render the investor password modal when the user clicks on investor password tab', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        expect(screen.getByText(/Investor password/i)).toBeInTheDocument();
        waitFor(() => {
            fireEvent.click(screen.getByText(/Investor password/i));
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
        screen.debug();
    });

    it('should change input of current investor password and new investor password and trigger change investor password button', async () => {
        const handleSubmit = jest.fn();
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} onSubmit={handleSubmit} />);
        expect(screen.getByText(/Investor password/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Investor password/i));

        await waitFor(() => {
            expect(screen.getByText(/New investor password/i)).toBeInTheDocument();
        });

        const current_investor_password = screen.getByLabelText(/Current investor password/i);
        fireEvent.click(screen.getByText(/Current investor password/i));

        await waitFor(() => {
            fireEvent.change(current_investor_password, { target: { value: 'Testing1234' } });
        });

        const new_investor_password = screen.getByLabelText('New investor password');
        fireEvent.click(new_investor_password);
        await waitFor(() => {
            fireEvent.change(new_investor_password, { target: { value: 'abcabcabc' } });
        });

        fireEvent.click(await screen.findByRole('button', { name: /Change investor password/i }));
        expect(current_investor_password).toHaveValue('Testing1234');
        expect(new_investor_password).toHaveValue('abcabcabc');
    });

    it('should render SentEmailModal if the user clicks create or reset investor password', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        fireEvent.click(screen.getByText(/Investor password/i));
        fireEvent.click(screen.getByText(/Create or reset investor password/i));
        await waitFor(() => {
            expect(screen.getByText(/We've sent you an email/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/IcEmailSent/i)).toBeInTheDocument();
    });

    it('should go back to the previous investor password modal if the user clicks back in the sentemailmodal', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        fireEvent.click(screen.getByText(/Investor password/i));
        fireEvent.click(screen.getByText(/Create or reset investor password/i));
        await waitFor(() => {
            expect(screen.getByText(/We've sent you an email/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/IcEmailSent/i)).toBeInTheDocument();
        await waitFor(() => {
            fireEvent.click(screen.getByText(/Back/i));
        });
        await waitFor(() => {
            expect(
                screen.getByText(
                    /Use this password to log in to your DMT5 accounts on the desktop, web, and mobile apps/i
                )
            ).toBeInTheDocument();
        });
    });

    it('should render the correct header title for investor password modal for real account', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} selected_account_group='real' />);
        expect(screen.getByText(/Investor password/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Investor password/i));
        await waitFor(() => {
            expect(screen.getByText(/Manage DMT5 Real Synthetic account password/i)).toBeInTheDocument();
        });
    });
});
