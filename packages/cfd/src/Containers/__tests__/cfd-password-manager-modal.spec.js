import React from 'react';
import { screen, render, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import CFDPasswordManagerModal from '../cfd-password-manager-modal';
import { BrowserRouter } from 'react-router-dom';
import CFDProviders from '../../cfd-providers';
import { mockStore } from '@deriv/stores';

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
    useWS: () => undefined,
}));

jest.mock('@contentpass/zxcvbn', () => ({
    ...jest.requireActual('@contentpass/zxcvbn'),
    lib: {
        zxcvbn: jest.fn(() => ({
            score: 0,
            feedback: {
                warning: '',
                suggestions: [],
            },
        })),
    },
}));

const validPasswordMock = value => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+/.test(value);

const validLengthMock = (value, options) =>
    (options.min ? value.length >= options.min : true) && (options.max ? value.length <= options.max : true);

const mock_errors = {
    password: () => localize('Password should have lower and uppercase English letters with numbers.'),
    repeated_chars_are_easy: () => localize('Repeats like "aaa" are easy to guess'),
    repeated_patterns_are_easy: () => localize('Repeats like "abcabcabc" are only slightly harder to guess than "abc"'),
    recent_years_are_easy: () => localize('Recent years are easy to guess'),
};

jest.mock('@deriv/shared/src/utils/validation/declarative-validation-rules.ts', () => {
    const original_module = jest.requireActual('@deriv/shared/src/utils/validation/declarative-validation-rules.ts');
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

describe('<CFDPasswordManagerModal />', () => {
    const mockRootStore = {
        ui: {
            enableApp: jest.fn(),
            disableApp: jest.fn(),
        },
        client: {
            email: 'test@domain.com',
        },
        modules: {
            cfd: {
                sendVerifyEmail: jest.fn(),
            },
        },
    };
    const renderwithRouter = component => {
        render(<BrowserRouter>{component}</BrowserRouter>, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
        });
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
        is_visible: true,
        platform: 'mt5',
        selected_login: 'MTD20103241',
        selected_account: 'Standard',
        toggleModal: jest.fn(),
        selected_account_type: 'financial',
        selected_account_group: 'demo',
        selected_server: 'p01_ts03',
    };

    it('should render the deriv mt5 password modal', () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        expect(screen.getByText(/manage deriv mt5 password/i)).toBeInTheDocument();
        expect(screen.getAllByText(/deriv mt5 password/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/IcMt5OnePassword/i)).toBeInTheDocument();
        expect(screen.getAllByText(/deriv mt5 password/i)[1]).toBeInTheDocument();
        expect(screen.getByText(/investor password/i)).toBeInTheDocument();
        expect(screen.getAllByText(/deriv mt5 password/i)[2]).toBeInTheDocument();
        expect(
            screen.getByText(
                /use this password to log in to your deriv mt5 accounts on the desktop, web, and mobile apps/i
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('should render CFDPasswordManagerModal if change password button is clicked', () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        fireEvent.click(screen.getByRole('button', { name: /change password/i }));
        expect(screen.getByText(/confirm to change your deriv mt5 password/i)).toBeInTheDocument();
        expect(
            screen.getByText(/this will change the password to all of your deriv mt5 accounts/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    });

    it('should render SentEmailModal if confirm button is clicked', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        fireEvent.click(screen.getByRole('button', { name: /change password/i }));
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
        expect(await screen.findByText(/we've sent you an email/i)).toBeInTheDocument();
        expect(
            await screen.findByText(/please click on the link in the email to change your deriv mt5 password./i)
        ).toBeInTheDocument();

        expect(await screen.findByText(/didn't receive the email?/i)).toBeInTheDocument();
    });

    it('should render the CFDPasswordManagerModal for deriv x', () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        expect(screen.getByText(/manage deriv x password/i)).toBeInTheDocument();
        expect(screen.getByText(/IcDxtradeOnePassword/i)).toBeInTheDocument();
        expect(screen.getAllByText(/deriv x password/i)[0]).toBeInTheDocument();
        expect(
            screen.getByText(/use this password to log in to your deriv x accounts on the web and mobile apps/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('should render ChangePasswordConfirmationModal if change deriv x button is clicked', () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /change password/i }));
        expect(screen.getByText(/confirm to change your deriv x password/i)).toBeInTheDocument();
        expect(screen.getByText(/this will change the password to all of your deriv x accounts/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    });

    it('should render SentEmailModal if confirm button is clicked for deriv x', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /change password/i }));
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
        expect(await screen.findByText(/we've sent you an email/i)).toBeInTheDocument();

        expect(
            await screen.findByText(/please click on the link in the email to change your deriv x password./i)
        ).toBeInTheDocument();

        expect(await screen.findByText(/didn't receive the email?/i)).toBeInTheDocument();
    });

    it("should render the resend email button if a user clicks didn't receive the email", async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /change password/i }));
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
        expect(await screen.findByText(/we've sent you an email/i)).toBeInTheDocument();

        expect(
            await screen.findByText(/please click on the link in the email to change your deriv x password./i)
        ).toBeInTheDocument();

        expect(await screen.findByText(/didn't receive the email?/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /didn't receive the email?/i }));
        expect(await screen.findByRole('button', { name: /resend email/i })).toBeInTheDocument();
    });

    it('should start the countdown if the user clicks on resend email', async () => {
        jest.useFakeTimers();
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /change password/i }));
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
        expect(await screen.findByText(/we've sent you an email/i)).toBeInTheDocument();
        expect(
            await screen.findByText(/please click on the link in the email to change your deriv x password./i)
        ).toBeInTheDocument();
        expect(await screen.findByText(/didn't receive the email?/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /didn't receive the email?/i }));
        expect(await screen.findByRole('button', { name: /resend email/i })).toBeInTheDocument();
        fireEvent.click(await screen.findByRole('button', { name: /resend email/i }));
        act(() => {
            jest.advanceTimersByTime(1500);
        });
        expect(await screen.findByText(/resend email in 59/i)).toBeInTheDocument();
    });

    it('should disable the button for 60 seconds after clicking resend email', async () => {
        jest.useFakeTimers();
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /change password/i }));
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
        expect(await screen.findByText(/we've sent you an email/i)).toBeInTheDocument();
        expect(
            await screen.findByText(/please click on the link in the email to change your deriv x password./i)
        ).toBeInTheDocument();
        expect(await screen.findByText(/didn't receive the email?/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /didn't receive the email?/i }));
        expect(screen.getByRole('button', { name: /resend email/i })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /resend email/i }));
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(screen.getByRole('button', { name: /resend email in 59/i })).toBeDisabled();
    });

    it('should enable back the resend email button after 60 seconds', async () => {
        jest.useFakeTimers();
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} platform='dxtrade' />);
        fireEvent.click(screen.getByRole('button', { name: /change password/i }));
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
        expect(await screen.findByText(/we've sent you an email/i)).toBeInTheDocument();

        expect(
            await screen.findByText(/please click on the link in the email to change your deriv x password./i)
        ).toBeInTheDocument();

        await waitFor(() => expect(screen.getByText(/didn't receive the email?/i)).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /didn't receive the email?/i }));
        await waitFor(() => expect(screen.getByRole('button', { name: /resend email/i })).toBeInTheDocument());
        fireEvent.click(screen.getByRole('button', { name: /resend email/i }));
        act(() => {
            jest.advanceTimersByTime(60000);
        });
        expect(screen.getByRole('button', { name: /resend email/i })).toBeEnabled();
    });

    it('should render the InvestorPasswordManager when the user clicks on investor password tab', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        expect(screen.getByText(/investor password/i)).toBeInTheDocument();
        fireEvent.click(await screen.findByText(/investor password/i));
        expect(
            screen.getByText(
                /use this password to grant viewing access to another user. While they may view your trading account, they will not be able to trade or take any other actions/i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /if this is the first time you try to create a password, or you have forgotten your password, please reset it/i
            )
        ).toBeInTheDocument();
    });

    it('should change input of current investor password and new investor password and trigger change investor password button', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        expect(screen.getByText(/investor password/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/investor password/i));
        await waitFor(() => {
            expect(screen.getByText(/new investor password/i)).toBeInTheDocument();
        });
        const current_investor_password = screen.getByLabelText(/current investor password/i);
        const new_investor_password = screen.getByLabelText('New investor password');

        fireEvent.change(current_investor_password, { target: { value: 'Testing1234' } });
        fireEvent.blur(current_investor_password);
        fireEvent.change(new_investor_password, { target: { value: 'XCvnhnkdh!111' } });
        fireEvent.blur(new_investor_password);

        expect(current_investor_password).toHaveValue('Testing1234');
        expect(new_investor_password).toHaveValue('XCvnhnkdh!111');
        expect(screen.getByRole('button', { name: /change investor password/i })).toBeEnabled();

        fireEvent.click(screen.getByRole('button', { name: /change investor password/i }));
        expect(
            await screen.findByText(
                /if this is the first time you try to create a password, or you have forgotten your password, please reset it/i
            )
        ).toBeInTheDocument();
    });

    it('should render SentEmailModal if the user clicks create or reset investor password', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        fireEvent.click(screen.getByText(/investor password/i));
        fireEvent.click(screen.getByText(/create or reset investor password/i));

        expect(await screen.findByText(/we've sent you an email/i)).toBeInTheDocument();

        expect(screen.getByText(/IcEmailSent/i)).toBeInTheDocument();
    });

    it('should go back to the previous investor password modal if the user clicks back in the SentEmailModal', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} />);
        fireEvent.click(screen.getByText(/investor password/i));
        fireEvent.click(screen.getByText(/create or reset investor password/i));
        expect(await screen.findByText(/we've sent you an email/i)).toBeInTheDocument();
        expect(screen.getByText(/IcEmailSent/i)).toBeInTheDocument();
        fireEvent.click(await screen.findByText(/back/i));

        expect(
            await screen.findByText(
                /use this password to log in to your deriv mt5 accounts on the desktop, web, and mobile apps/i
            )
        ).toBeInTheDocument();
    });

    it('should render the correct header title for investor password modal for real account', async () => {
        renderwithRouter(<CFDPasswordManagerModal {...mock_props} selected_account_group='real' />);
        expect(screen.getByText(/investor password/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/investor password/i));

        expect(await screen.findByText(/manage deriv mt5 password/i)).toBeInTheDocument();
    });
});
