import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { WS, validPassword, getErrorMessages } from '@deriv/shared';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CFDPasswordModal from '../cfd-password-modal';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/account', () => ({
    SentEmailModal: jest.fn(({ should_show_sent_email_modal }) => (
        <div>{should_show_sent_email_modal && <span>SentEmailModal</span>}</div>
    )),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getErrorMessages: jest.fn().mockReturnValue({
        password_warnings: '',
        password: jest.fn(),
    }),
    isDesktop: jest.fn().mockReturnValue(true),
    WS: {
        verifyEmail: jest.fn(),
    },
    validPassword: jest.fn().mockReturnValue(true),
}));

describe('ChangePasswordConfirmation', () => {
    const mockFn = jest.fn();
    const history = createBrowserHistory();
    let modal_root_el;
    const mock_props = {
        account_title: '',
        account_type: {},
        account_status: {},
        disableCFDPasswordModal: null,
        email: '',
        error_message: '',
        error_type: '',
        form_error: '',
        getAccountStatus: null,
        history: history,
        is_eu: false,
        is_fully_authenticated: false,
        is_cfd_password_modal_enabled: false,
        is_cfd_success_dialog_enabled: false,
        is_dxtrade_allowed: false,
        platform: '',
        has_cfd_error: false,
        landing_companies: {},
        mt5_login_list: [],
        cfd_new_account: {},
        setCFDSuccessDialog: null,
        setMt5Error: null,
        submitMt5Password: null,
        submitCFDPassword: null,
    };

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render create Password modal when valid conditions are met', async () => {
        const props = {
            ...mock_props,
            is_cfd_password_modal_enabled: true,
            is_cfd_success_dialog_enabled: false,
            account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            getAccountStatus: mockFn,
            platform: 'mt5',
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...props} />
            </Router>
        );
        expect(await screen.findByTestId('create-password')).toBeInTheDocument();
    });

    it('should render password form with Try later button', async () => {
        const props = {
            ...mock_props,
            is_cfd_password_modal_enabled: true,
            is_cfd_success_dialog_enabled: false,
            account_status: { status: [] },
            getAccountStatus: mockFn,
            platform: 'mt5',
            error_type: 'PasswordReset',
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...props} />
            </Router>
        );

        expect(await screen.findByRole('button', { name: /Try later/i })).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /Forgot password?/i })).toBeInTheDocument();
    });

    it('should close modal when Cancel button is clicked', async () => {
        const mockDisableCFDPasswordModalFn = jest.fn();
        const props = {
            ...mock_props,
            is_cfd_password_modal_enabled: true,
            is_cfd_success_dialog_enabled: false,
            account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            getAccountStatus: mockFn,
            platform: 'mt5',
            error_type: 'PasswordReset',
            setCFDSuccessDialog: mockFn,
            setMt5Error: mockDisableCFDPasswordModalFn,
            disableCFDPasswordModal: mockFn,
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...props} />
            </Router>
        );
        const ele_cancel_btn = await screen.findByRole('button', { name: /Forgot password?/i });
        fireEvent.click(ele_cancel_btn);

        await waitFor(() => {
            expect(mockFn).toHaveBeenCalledWith(false);
            expect(mockDisableCFDPasswordModalFn).toHaveBeenCalled();
            expect(mockFn).toHaveBeenCalledWith(false);
        });
    });

    it('should invoke verifyEmail when forgot password is clicked', async () => {
        const mockDisableCFDPasswordModalFn = jest.fn();
        const props = {
            ...mock_props,
            is_cfd_password_modal_enabled: true,
            is_cfd_success_dialog_enabled: false,
            account_status: { status: [], category: 'Real' },
            getAccountStatus: mockFn,
            platform: 'mt5',
            error_type: 'PasswordReset',
            setCFDSuccessDialog: mockFn,
            setMt5Error: mockDisableCFDPasswordModalFn,
            disableCFDPasswordModal: mockFn,
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...props} />
            </Router>
        );
        const ele_cancel_btn = await screen.findByRole('button', { name: /Forgot password?/i });
        fireEvent.click(ele_cancel_btn);
        await waitFor(() => {
            expect(WS.verifyEmail).toHaveBeenCalled();
        });
    });

    it('should display password field for user to enter the password', async () => {
        const props = {
            ...mock_props,
            is_cfd_password_modal_enabled: true,
            is_cfd_success_dialog_enabled: false,
            account_status: { status: [], category: 'Real' },
            getAccountStatus: mockFn,
            platform: 'mt5',
            error_type: '',
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...props} />
            </Router>
        );

        expect(await screen.findByText(/Enter your DMT5 password to add a DMT5 account/i)).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /Add account/i })).toBeInTheDocument();
        expect(await screen.findByTestId('mt5_password')).toBeInTheDocument();
    });

    it('should hold the password value provided by the user', async () => {
        const user_input = 'zo8lAet#2q01Ih';
        const props = {
            ...mock_props,
            is_cfd_password_modal_enabled: true,
            is_cfd_success_dialog_enabled: false,
            account_status: { status: [], category: 'Real' },
            getAccountStatus: mockFn,
            platform: 'mt5',
            error_type: 'PasswordError',
            account_type: { category: 'real', type: 'financial_stp' },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...props} />
            </Router>
        );
        const ele_password_field = await screen.findByTestId('mt5_password');
        fireEvent.change(ele_password_field, { target: { value: user_input } });

        await waitFor(() => {
            expect(ele_password_field.value).toEqual(user_input);
        });
    });

    it('should display error message when password does not meet requirements', async () => {
        validPassword.mockReturnValue(false);
        const user_input = 'demo@deriv.com';
        const props = {
            ...mock_props,
            is_cfd_password_modal_enabled: true,
            is_cfd_success_dialog_enabled: false,
            account_status: { status: [], category: 'Real' },
            getAccountStatus: mockFn,
            platform: 'mt5',
            email: user_input,
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...props} />
            </Router>
        );
        const ele_password_input = await screen.findByTestId('mt5_password');
        fireEvent.change(ele_password_input, { target: { value: user_input } });
        fireEvent.focusOut(ele_password_input);

        await waitFor(() => {
            expect(validPassword).toHaveBeenCalled();
        });
    });

    it('should show password dialog asking user to provide POI', async () => {
        const props = {
            ...mock_props,
            is_cfd_password_modal_enabled: true,
            is_cfd_success_dialog_enabled: true,
            is_password_modal_exited: true,
            account_type: { category: 'real', type: 'financial_stp' },
            getAccountStatus: mockFn,
            platform: 'mt5',
            is_eu: true,
            is_fully_authenticated: false,
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...props} />
            </Router>
        );

        screen.debug();

        expect(
            await screen.findByText(/We need proof of your identity and address before you can start trading./i)
        ).toBeInTheDocument();
    });

    it('should close the dialog when you click on submit proof', async () => {
        const mockDisableCFDPasswordModalFn = jest.fn();
        const props = {
            ...mock_props,
            is_cfd_password_modal_enabled: true,
            is_cfd_success_dialog_enabled: true,
            is_password_modal_exited: true,
            account_type: { category: 'real', type: 'financial_stp' },
            getAccountStatus: mockFn,
            platform: 'mt5',
            is_eu: true,
            is_fully_authenticated: false,
            setCFDSuccessDialog: mockFn,
            setMt5Error: mockDisableCFDPasswordModalFn,
            disableCFDPasswordModal: mockFn,
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...props} />
            </Router>
        );

        fireEvent.click(await screen.findByRole('button', { name: /Submit proof/i }));

        await waitFor(() => {
            expect(mockFn).toHaveBeenCalledWith(false);
            expect(mockDisableCFDPasswordModalFn).toHaveBeenCalled();
            expect(mockFn).toHaveBeenCalledWith(false);
        });
    });

    it('should show success message with options to transfer now or later when password has been updated successfully', async () => {
        const props = {
            ...mock_props,
            is_cfd_password_modal_enabled: true,
            is_cfd_success_dialog_enabled: true,
            is_password_modal_exited: true,
            account_type: { category: 'real', type: 'financial_stp' },
            getAccountStatus: mockFn,
            platform: 'mt5',
            is_eu: true,
            is_fully_authenticated: true,
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...props} />
            </Router>
        );

        expect(await screen.findByRole('button', { name: /Maybe later/i }));
        expect(await screen.findByRole('button', { name: /Transfer now/i }));
    });

    // it('should show Sent mail modal ', async ()=>{
    //     const props = {
    //         ...mock_props,
    //         is_cfd_password_modal_enabled: true,
    //         is_cfd_success_dialog_enabled: false,
    //         account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
    //         getAccountStatus: mockFn,
    //         platform: 'mt5',
    //     };

    //     render(
    //         <Router history={history}>
    //             <CFDPasswordModal {...props} />
    //         </Router>
    //     );
    // })
});
