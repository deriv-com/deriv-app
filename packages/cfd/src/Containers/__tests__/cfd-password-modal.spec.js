import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { WS, validPassword } from '@deriv/shared';
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

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(({ icon }) => <div>{icon}</div>),
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

jest.mock('../../Assets/svgs/trading-platform', () => jest.fn(() => 'MockedMT5Icon'));
describe('<CFDPasswordModal/>', () => {
    const mockFn = jest.fn();
    const mockDisableCFDPasswordModalFn = jest.fn();
    const mockSetMt5Error = jest.fn();
    const mockSetCFDSuccessDialog = jest.fn();
    const mockSubmitMt5Password = jest.fn();
    const mockSubmitCFDPasswordFn = jest.fn();
    const history = createBrowserHistory();
    let modal_root_el;
    const mock_props = {
        account_title: '',
        account_type: {},
        account_status: {},
        disableCFDPasswordModal: mockDisableCFDPasswordModalFn,
        email: '',
        error_message: '',
        error_type: '',
        form_error: '',
        getAccountStatus: mockFn,
        history: history,
        is_eu: false,
        is_fully_authenticated: false,
        is_cfd_password_modal_enabled: true,
        is_cfd_success_dialog_enabled: false,
        is_dxtrade_allowed: false,
        jurisdiction_selected_shortcode: 'svg',
        platform: 'mt5',
        has_cfd_error: false,
        landing_companies: {},
        mt5_login_list: [],
        cfd_new_account: {},
        setCFDSuccessDialog: mockSetCFDSuccessDialog,
        setMt5Error: mockSetMt5Error,
        submitMt5Password: mockSubmitMt5Password,
        submitCFDPassword: mockSubmitCFDPasswordFn,
        updateAccountStatus: jest.fn(),
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
        render(
            <Router history={history}>
                <CFDPasswordModal
                    {...mock_props}
                    account_status={{ status: ['mt5_password_not_set', 'dxtrade_password_not_set'] }}
                />
            </Router>
        );
        expect(await screen.findByTestId('dt_create_password')).toBeInTheDocument();
    });

    it('should render password form with Try later button and forget password button', async () => {
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} account_status={{ status: [] }} error_type='PasswordReset' />
            </Router>
        );

        expect(await screen.findByRole('button', { name: /try later/i })).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /forgot password?/i })).toBeInTheDocument();
    });

    it('should close modal when Forget Password button is clicked', async () => {
        render(
            <Router history={history}>
                <CFDPasswordModal
                    {...mock_props}
                    account_status={{ status: ['mt5_password_not_set', 'dxtrade_password_not_set'] }}
                    error_type='PasswordReset'
                />
            </Router>
        );
        const ele_forget_btn = await screen.findByRole('button', { name: /forgot password?/i });
        fireEvent.click(ele_forget_btn);

        await waitFor(() => {
            expect(mockSetCFDSuccessDialog).toHaveBeenCalledWith(false);
            expect(mockDisableCFDPasswordModalFn).toHaveBeenCalled();
            expect(mockSetMt5Error).toHaveBeenCalledWith(false);
        });
    });

    it('should invoke verifyEmail when forgot password is clicked', async () => {
        render(
            <Router history={history}>
                <CFDPasswordModal
                    {...mock_props}
                    account_status={{ status: [], category: 'Real' }}
                    error_type='PasswordReset'
                    account_type={{ category: 'real', type: 'financial' }}
                />
            </Router>
        );
        const ele_forget_btn = await screen.findByRole('button', { name: /forgot password?/i });
        fireEvent.click(ele_forget_btn);
        await waitFor(() => {
            expect(WS.verifyEmail).toHaveBeenCalled();
        });
    });

    it('should display password field for user to enter the password and hold the entered value', async () => {
        const user_input = 'zo8lAet#2q01Ih';
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} account_status={{ status: [], category: 'Real' }} />
            </Router>
        );

        const ele_password_field = await screen.findByTestId('dt_mt5_password');
        fireEvent.change(ele_password_field, { target: { value: user_input } });

        expect(await screen.findByRole('button', { name: /add account/i })).toBeInTheDocument();

        await waitFor(() => {
            expect(ele_password_field.value).toEqual(user_input);
        });
    });

    it('should display error message when password does not meet requirements', async () => {
        validPassword.mockReturnValue(false);
        const user_input = 'demo@deriv.com';
        render(
            <Router history={history}>
                <CFDPasswordModal
                    {...mock_props}
                    account_status={{ status: [], category: 'Real' }}
                    email={user_input}
                />
            </Router>
        );
        const ele_password_input = await screen.findByTestId('dt_mt5_password');
        fireEvent.change(ele_password_input, { target: { value: user_input } });
        await waitFor(() => {
            fireEvent.focusOut(ele_password_input);
        });

        await waitFor(() => {
            expect(validPassword).toHaveBeenCalled();
        });
        expect(await screen.findByText(/your password cannot be the same as your email address./i)).toBeInTheDocument();
    });

    it('should show transfer message on successful DerivX account creation', async () => {
        const props = {
            is_cfd_success_dialog_enabled: true,
            is_password_modal_exited: true,
            account_type: { category: 'real', type: 'financial' },
            is_eu: false,
            is_fully_authenticated: false,
            platform: 'dxtrade',
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} />
            </Router>
        );

        expect(
            await screen.findByText(/to start trading, transfer funds from your Deriv account into this account./i)
        ).toBeInTheDocument();
    });

    it('should close the dialog when you click on ok button', async () => {
        const props = {
            is_cfd_success_dialog_enabled: true,
            is_password_modal_exited: true,
            account_type: { category: 'real', type: 'financial' },
            is_eu: true,
            is_fully_authenticated: false,
            jurisdiction_selected_shortcode: 'bvi',
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} />
            </Router>
        );

        fireEvent.click(await screen.findByRole('button', { name: /ok/i }));

        await waitFor(() => {
            expect(mockSetCFDSuccessDialog).toHaveBeenCalledWith(false);
            expect(mockDisableCFDPasswordModalFn).toHaveBeenCalled();
            expect(mockSetMt5Error).toHaveBeenCalledWith(false);
        });
    });

    it('should show success dialog with buttons to Transfer now or later when password has been updated successfully', async () => {
        render(
            <Router history={history}>
                <CFDPasswordModal
                    {...mock_props}
                    is_eu
                    is_fully_authenticated
                    is_cfd_success_dialog_enabled
                    is_password_modal_exited
                    account_type={{ category: 'real', type: 'financial' }}
                />
            </Router>
        );

        expect(await screen.findByRole('button', { name: /maybe later/i }));
        expect(await screen.findByRole('button', { name: /transfer now/i }));
    });

    it('should display Derived icon in Success Dialog', async () => {
        const props = {
            account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            error_type: 'PasswordError',
            account_type: { category: 'real', type: 'synthetic' },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} is_cfd_success_dialog_enabled is_eu />
            </Router>
        );

        expect(await screen.findByText('IcMt5SyntheticPlatform')).toBeInTheDocument();
    });

    it('should display icon in Success Dialog in tradershub', async () => {
        const props = {
            account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            error_type: 'PasswordError',
            account_type: { category: 'real', type: 'synthetic' },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} is_cfd_success_dialog_enabled is_eu />
            </Router>
        );

        expect(await screen.findByText('IcMt5SyntheticPlatform')).toBeInTheDocument();
    });

    it('should display Financial icon in Success Dialog', async () => {
        const props = {
            account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            error_type: 'PasswordError',
            account_type: { category: 'real', type: 'financial' },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} is_cfd_success_dialog_enabled />
            </Router>
        );

        expect(await screen.findByText('IcMt5FinancialPlatform')).toBeInTheDocument();
    });

    it('should display IcDxtradeSyntheticPlatform icon in Success Dialog', async () => {
        const props = {
            account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            platform: 'dxtrade',
            error_type: 'PasswordError',
            account_type: { category: 'real', type: 'synthetic' },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} is_cfd_success_dialog_enabled />
            </Router>
        );

        expect(await screen.findByText('IcDxtradeSyntheticPlatform')).toBeInTheDocument();
    });

    it('should display IcDxtradeFinancialPlatform icon in Success Dialog', async () => {
        const props = {
            account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            platform: 'dxtrade',
            error_type: 'PasswordError',
            account_type: { category: 'real', type: 'financial' },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} is_cfd_success_dialog_enabled />
            </Router>
        );

        expect(await screen.findByText('IcDxtradeFinancialPlatform')).toBeInTheDocument();
    });

    it('should display IcCfds icon in Success Dialog', async () => {
        const props = {
            account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            error_type: 'PasswordError',
            account_type: { category: 'real', type: 'financial' },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} show_eu_related_content is_cfd_success_dialog_enabled />
            </Router>
        );
        expect(await screen.findByText('IcMt5CfdPlatform')).toBeInTheDocument();
    });

    it('should invoke verifyEmail for DerivX when Forgot password is clicked', async () => {
        const props = {
            account_status: { status: [], category: 'Real' },
            platform: 'dxtrade',
            error_type: 'PasswordReset',
            setCFDSuccessDialog: mockFn,
            account_type: { category: 'demo', type: 'financial' },
            email: 'demo@deriv.com',
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} />
            </Router>
        );
        const ele_forget_btn = await screen.findByRole('button', { name: /forgot password?/i });
        fireEvent.click(ele_forget_btn);
        await waitFor(() => {
            expect(WS.verifyEmail).toHaveBeenCalledWith('demo@deriv.com', 'trading_platform_dxtrade_password_reset', {
                url_parameters: { redirect_to: 21 },
            });
        });
    });

    it('should create Deriv MT5 password when clicked on Create Deriv MT5 password', async () => {
        const user_input = 'zo8lAet#2q01Ih';
        validPassword.mockReturnValue(true);

        render(
            <Router history={history}>
                <CFDPasswordModal
                    {...mock_props}
                    account_status={{ status: ['mt5_password_not_set'], category: 'Real' }}
                    account_type={{ category: 'real', type: 'financial' }}
                />
                ;
            </Router>
        );
        fireEvent.change(await screen.findByTestId('dt_mt5_password'), { target: { value: user_input } });
        fireEvent.click(await screen.findByRole('button', { name: 'Create Deriv MT5 password' }));

        await waitFor(() => {
            expect(mockSubmitMt5Password).toHaveBeenCalled();
        });
    });

    it('should create DerivX platform password when clicked on Add account', async () => {
        const user_input = 'zo8lAet#2q01Ih';
        validPassword.mockReturnValue(true);

        render(
            <Router history={history}>
                <CFDPasswordModal
                    {...mock_props}
                    account_status={{ status: ['mt5_password_not_set'], category: 'Real' }}
                    platform='dxtrade'
                    account_type={{ category: 'real', type: 'financial' }}
                />
                ;
            </Router>
        );
        fireEvent.change(await screen.findByTestId('dt_dxtrade_password'), { target: { value: user_input } });
        fireEvent.click(await screen.findByRole('button', { name: 'Add account' }));

        await waitFor(() => {
            expect(mockSubmitCFDPasswordFn).toHaveBeenCalled();
        });
    });
});
