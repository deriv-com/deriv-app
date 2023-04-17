import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { WS, validPassword } from '@deriv/shared';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CFDPasswordModal from '../cfd-password-modal';
import CFDProviders from '../../cfd-providers';
import { mockStore } from '@deriv/stores';

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

    const mockRootStore = {
        client: {
            email: '',
            account_status: {},
            updateAccountStatus: jest.fn(),
            landing_companies: {},
            mt5_login_list: [],
            is_dxtrade_allowed: false,
        },
        traders_hub: {
            show_eu_related_content: false,
        },
        modules: {
            cfd: {
                is_cfd_password_modal_enabled: true,
                is_cfd_success_dialog_enabled: false,
                submitMt5Password: mockSubmitMt5Password,
                submitCFDPassword: mockSubmitCFDPasswordFn,
                setError: mockSetMt5Error,
                setCFDSuccessDialog: mockSetCFDSuccessDialog,
                has_cfd_error: false,
                error_message: '',
                error_type: '',
                account_title: '',
                account_type: {},
                disableCFDPasswordModal: mockDisableCFDPasswordModalFn,
                getAccountStatus: mockFn,
                new_account_response: {},
                jurisdiction_selected_shortcode: 'svg',
            },
        },
    };

    const mock_props = {
        form_error: '',
        history: history,
        platform: 'mt5',
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
        const mockExtraRootStore = {
            client: {
                account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );
        expect(await screen.findByTestId('dt_create_password')).toBeInTheDocument();
    });

    it('should render password form with Try later button and forget password button', async () => {
        const mockExtraRootStore = {
            client: {
                account_status: { status: [] },
            },
            modules: {
                cfd: {
                    error_type: 'PasswordReset',
                },
            },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: { cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd } },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );

        expect(await screen.findByRole('button', { name: /try later/i })).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /forgot password?/i })).toBeInTheDocument();
    });

    it('should close modal when Forget Password button is clicked', async () => {
        const mockExtraRootStore = {
            client: {
                account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            },
            modules: {
                cfd: {
                    error_type: 'PasswordReset',
                },
            },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} error_type='PasswordReset' />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: { cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd } },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
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
        const mockExtraRootStore = {
            client: {
                account_status: { status: [], category: 'Real' },
            },
            modules: {
                cfd: {
                    error_type: 'PasswordReset',
                    account_type: { category: 'real', type: 'financial' },
                },
            },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: { cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd } },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );
        const ele_forget_btn = await screen.findByRole('button', { name: /forgot password?/i });
        fireEvent.click(ele_forget_btn);
        await waitFor(() => {
            expect(WS.verifyEmail).toHaveBeenCalled();
        });
    });

    it('should display password field for user to enter the password and hold the entered value', async () => {
        const user_input = 'zo8lAet#2q01Ih';
        const mockExtraRootStore = {
            client: {
                account_status: { status: [], category: 'Real' },
            },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
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
        const mockExtraRootStore = {
            client: {
                account_status: { status: [], category: 'Real' },
                email: user_input,
            },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
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
            platform: 'dxtrade',
        };

        const mockExtraRootStore = {
            client: {
                account_status: { status: [], category: 'Real' },
            },
            modules: {
                cfd: {
                    error_type: 'PasswordReset',
                    account_type: { category: 'real', type: 'financial' },
                    is_cfd_success_dialog_enabled: true,
                },
            },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );

        expect(
            await screen.findByText(/to start trading, transfer funds from your Deriv account into this account./i)
        ).toBeInTheDocument();
    });

    it('should close the dialog when you click on ok button', async () => {
        const mockExtraRootStore = {
            client: {
                account_status: { status: [], category: 'Real' },
            },
            modules: {
                cfd: {
                    account_type: { category: 'real', type: 'financial' },
                    is_cfd_success_dialog_enabled: true,
                    jurisdiction_selected_shortcode: 'bvi',
                },
            },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );

        fireEvent.click(await screen.findByRole('button', { name: /ok/i }));

        await waitFor(() => {
            expect(mockSetCFDSuccessDialog).toHaveBeenCalledWith(false);
            expect(mockDisableCFDPasswordModalFn).toHaveBeenCalled();
            expect(mockSetMt5Error).toHaveBeenCalledWith(false);
        });
    });

    it('should show success dialog with buttons to Transfer now or later when password has been updated successfully', async () => {
        const mockExtraRootStore = {
            modules: {
                cfd: {
                    account_type: { category: 'real', type: 'financial' },
                    is_cfd_success_dialog_enabled: true,
                },
            },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );

        expect(await screen.findByRole('button', { name: /maybe later/i }));
        expect(await screen.findByRole('button', { name: /transfer now/i }));
    });

    it('should display Derived icon in Success Dialog', async () => {
        const mockExtraRootStore = {
            client: {
                account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            },
            modules: {
                cfd: {
                    account_type: { category: 'real', type: 'synthetic' },
                    is_cfd_success_dialog_enabled: true,
                    error_type: 'PasswordError',
                },
            },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );

        expect(await screen.findByText('IcMt5SyntheticPlatform')).toBeInTheDocument();
    });

    it('should display icon in Success Dialog in tradershub', async () => {
        const mockExtraRootStore = {
            client: {
                account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            },
            modules: {
                cfd: {
                    is_cfd_success_dialog_enabled: true,
                    account_type: { category: 'real', type: 'synthetic' },
                    error_type: 'PasswordError',
                },
            },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );

        expect(await screen.findByText('IcMt5SyntheticPlatform')).toBeInTheDocument();
    });

    it('should display Financial icon in Success Dialog', async () => {
        const mockExtraRootStore = {
            client: {
                account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            },
            modules: {
                cfd: {
                    is_cfd_success_dialog_enabled: true,
                    account_type: { category: 'real', type: 'financial' },
                    error_type: 'PasswordError',
                },
            },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );

        expect(await screen.findByText('IcMt5FinancialPlatform')).toBeInTheDocument();
    });

    it('should display IcDxtradeSyntheticPlatform icon in Success Dialog', async () => {
        const props = {
            platform: 'dxtrade',
        };

        const mockExtraRootStore = {
            client: {
                account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            },
            modules: {
                cfd: {
                    account_type: { category: 'real', type: 'synthetic' },
                    error_type: 'PasswordError',
                    is_cfd_success_dialog_enabled: true,
                },
            },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );

        expect(await screen.findByText('IcDxtradeSyntheticPlatform')).toBeInTheDocument();
    });

    it('should display IcDxtradeFinancialPlatform icon in Success Dialog', async () => {
        const props = {
            platform: 'dxtrade',
        };

        const mockExtraRootStore = {
            client: {
                account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            },
            modules: {
                cfd: {
                    account_type: { category: 'real', type: 'financial' },
                    error_type: 'PasswordError',
                    is_cfd_success_dialog_enabled: true,
                },
            },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );

        expect(await screen.findByText('IcDxtradeFinancialPlatform')).toBeInTheDocument();
    });

    it('should display IcCfds icon in Success Dialog', async () => {
        const mockExtraRootStore = {
            client: {
                account_status: { status: ['mt5_password_not_set', 'dxtrade_password_not_set'] },
            },
            traders_hub: { show_eu_related_content: true },
            modules: {
                cfd: {
                    account_type: { category: 'real', type: 'financial' },
                    error_type: 'PasswordError',
                    is_cfd_success_dialog_enabled: true,
                },
            },
        };
        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            traders_hub: { ...mockRootStore.traders_hub, ...mockExtraRootStore.traders_hub },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );
        expect(await screen.findByText('IcMt5CfdPlatform')).toBeInTheDocument();
    });

    it('should invoke verifyEmail for DerivX when Forgot password is clicked', async () => {
        const props = {
            platform: 'dxtrade',
        };

        const mockExtraRootStore = {
            client: {
                email: 'demo@deriv.com',
                account_status: { status: [], category: 'Real' },
            },
            modules: {
                cfd: {
                    account_type: { category: 'demo', type: 'financial' },
                    error_type: 'PasswordReset',
                    setCFDSuccessDialog: mockFn,
                },
            },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} {...props} />
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
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

        const mockExtraRootStore = {
            client: {
                account_status: { status: ['mt5_password_not_set'], category: 'Real' },
            },
            modules: {
                cfd: {
                    account_type: { category: 'real', type: 'financial' },
                },
            },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} />;
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
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

        const mockExtraRootStore = {
            client: {
                account_status: { status: ['mt5_password_not_set'], category: 'Real' },
            },
            modules: {
                cfd: {
                    account_type: { category: 'real', type: 'financial' },
                },
            },
        };

        render(
            <Router history={history}>
                <CFDPasswordModal {...mock_props} platform='dxtrade' />;
            </Router>,
            {
                wrapper: ({ children }) => (
                    <CFDProviders
                        store={mockStore({
                            ...mockRootStore,
                            client: { ...mockRootStore.client, ...mockExtraRootStore.client },
                            modules: {
                                cfd: { ...mockRootStore.modules.cfd, ...mockExtraRootStore.modules.cfd },
                            },
                        })}
                    >
                        {children}
                    </CFDProviders>
                ),
            }
        );
        fireEvent.change(await screen.findByTestId('dt_dxtrade_password'), { target: { value: user_input } });
        fireEvent.click(await screen.findByRole('button', { name: 'Add account' }));

        await waitFor(() => {
            expect(mockSubmitCFDPasswordFn).toHaveBeenCalled();
        });
    });
});
