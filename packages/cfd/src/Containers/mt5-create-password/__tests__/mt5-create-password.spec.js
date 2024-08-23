import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MT5CreatePassword from '../mt5-create-password';
import { mockStore } from '@deriv/stores';
import CFDProviders from '../../../cfd-providers';
import { getErrorMessages, validPassword } from '@deriv/shared';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(({ icon }) => <div>{icon}</div>),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getErrorMessages: jest.fn().mockReturnValue({
        password_warnings: '',
        password: jest.fn().mockReturnValue('Password should have lower and uppercase English letters with numbers.'),
    }),
    validPassword: jest.fn().mockReturnValue(true),
    isDesktop: jest.fn().mockReturnValue(true),
    DBVI_COMPANY_NAMES: {
        svg: { name: 'Sample Company', licence_name: 'Sample Licence' },
        other: { name: 'Other Company', licence_name: 'Other Licence' },
    },
}));

describe('<MT5CreatePassword/>', () => {
    const mockFn = jest.fn();
    const mockSubmitMt5Password = jest.fn();
    const history = createBrowserHistory();
    let modal_root_el;

    let mockRootStore = {
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
                submitMt5Password: mockSubmitMt5Password,
                setError: jest.fn(),
                setCFDSuccessDialog: jest.fn(),
                has_cfd_error: false,
                error_message: '',
                account_title: '',
                account_type: {},
                getAccountStatus: mockFn,
                new_account_response: {},
                jurisdiction_selected_shortcode: 'svg',
                setProduct: jest.fn(),
            },
        },
    };

    const default_props = {
        password: '',
        platform: 'mt5',
        error_message: '',
        validatePassword: jest.fn(),
        onSubmit: jest.fn(),
        need_tnc: true,
    };

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render MT5CreatePassword component', async () => {
        render(
            <Router history={history}>
                <MT5CreatePassword {...default_props} />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );

        expect(await screen.findByTestId('dt_create_password')).toBeInTheDocument();
    });

    it('should display password field for user to enter the password and hold the entered value', async () => {
        const user_input = 'zo8lAet#2q01Ih';

        render(
            <Router history={history}>
                <MT5CreatePassword {...default_props} />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );
        const password_input = await screen.findByTestId('dt_mt5_password');
        fireEvent.change(password_input, { target: { value: user_input } });
        await waitFor(() => {
            expect(password_input.value).toBe(user_input);
        });
    });

    it('should display password requirements message', async () => {
        render(
            <Router history={history}>
                <MT5CreatePassword {...default_props} />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );

        expect(await screen.findByText(/This password works for all your Deriv MT5 accounts./i)).toBeInTheDocument();
    });

    it('should show TNC checkbox when need_tnc is true', async () => {
        render(
            <Router history={history}>
                <MT5CreatePassword {...default_props} need_tnc={true} />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );
        const checkbox = await screen.findByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
    });

    it('should call onSubmit when form is submitted', async () => {
        const user_input = 'zo8lAet#2q01Ih';
        const onSubmit = jest.fn();
        const validatePassword = jest.fn().mockReturnValue({});

        render(
            <Router history={history}>
                <MT5CreatePassword
                    {...default_props}
                    password={user_input}
                    onSubmit={onSubmit}
                    validatePassword={validatePassword}
                />
            </Router>,
            {
                wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
            }
        );

        const passwordInput = await screen.findByTestId('dt_mt5_password');
        const submitButton = await screen.findByRole('button', { name: /Create account/i });

        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();

        fireEvent.change(passwordInput, { target: { value: user_input } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        });
    });
});
