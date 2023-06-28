import React from 'react';
import { screen, render, act, fireEvent, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { ResetTradingPasswordModal } from '../reset-trading-password-modal';
import { WS } from '@deriv/shared';

const mock_promise = Promise.resolve();
const mockFn = jest.fn();

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        tradingPlatformPasswordReset: jest.fn(() => mock_promise),
        getAccountStatus: jest.fn(),
    },
    getErrorMessages: jest.fn().mockReturnValue({
        password_warnings: false,
        password: jest.fn(),
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
        location: { search: 'test' },
        replace: mockFn,
    }),
}));

const interactWithPasswordField = async (trigger_click = true) => {
    await waitForElementToBeRemoved(() => screen.getByTestId('dt_initial_loader'));
    fireEvent.change(screen.getByLabelText('Deriv MT5 password', { selector: 'input' }), {
        target: { value: 'hN795jCWkDtPy5' },
    });
    if (trigger_click) {
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));
    }
};

describe('<ResetTradingPasswordModal/>', () => {
    const props: React.ComponentProps<typeof ResetTradingPasswordModal> = {
        disableApp: jest.fn(),
        enableApp: jest.fn(),
        toggleResetTradingPasswordModal: mockFn,
        is_loading: false,
        is_visible: true,
        verification_code: '',
        platform: 'mt5',
    };

    const history = createBrowserHistory();

    it('should render ResetTradingPasswordModal component', async () => {
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await act(() => mock_promise);
    });

    it('should remove the ResetTradingPasswordModal component when is_visible is false', async () => {
        const new_props = { ...props, is_visible: false };
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...new_props} />
            </Router>
        );
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('should render dialog title to specific CFDPlatform label', async () => {
        WS.tradingPlatformPasswordReset.mockReturnValue(
            Promise.resolve({ error: { message: 'Test error', code: 'InvalidToken' } })
        );
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await interactWithPasswordField();

        expect(await screen.findByText('Reset Deriv MT5 password')).toBeInTheDocument();
    });

    it('should display error message returned by API', async () => {
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await interactWithPasswordField();

        expect(await screen.findByText('Test error')).toBeInTheDocument();
        expect(
            await screen.findByText('Please request a new password and check your email for the new token.')
        ).toBeInTheDocument();
    });

    it('should close the dialog when Ok button is clicked', async () => {
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await interactWithPasswordField();
        const el_ok_button = await screen.findByRole('button', { name: /Ok/i });
        fireEvent.click(el_ok_button);

        expect(mockFn).toHaveBeenCalled();
    });

    it('should get the account status on successful submission', async () => {
        WS.tradingPlatformPasswordReset.mockReturnValue(Promise.resolve({ data: 'Test data' }));
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await interactWithPasswordField();

        await waitFor(() => {
            expect(WS.getAccountStatus).toHaveBeenCalled();
        });
    });

    it('should close the dialog when Done button is clicked', async () => {
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await interactWithPasswordField();
        const el_done_button = await screen.findByRole('button', { name: /Done/i });
        fireEvent.click(el_done_button);

        expect(mockFn).toHaveBeenCalled();
    });

    it('should display the password in text format when visibility icon clicked', async () => {
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await interactWithPasswordField(false);

        fireEvent.click(screen.getByTestId('dt_password_input_visibility_icon'));
        await waitFor(() => {
            expect(screen.getByDisplayValue('hN795jCWkDtPy5')).toHaveAttribute('type', 'text');
        });
    });

    it('should display the password in hidden format when visibility icon clicked consecutively twice', async () => {
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await interactWithPasswordField(false);
        const el_visibility_icon = await screen.findByTestId('dt_password_input_visibility_icon');
        fireEvent.click(el_visibility_icon);

        await waitFor(() => {
            expect(screen.getByDisplayValue('hN795jCWkDtPy5')).toHaveAttribute('type', 'text');
        });
    });

    it('should close the dialog when cancel button is clicked', async () => {
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.getByTestId('dt_initial_loader'));
        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

        await waitFor(() => {
            expect(mockFn).toHaveBeenCalled();
        });
    });

    it('should navigate to previous route when modal is closed ', () => {
        const new_props = {
            ...props,
            is_visible: false,
        };
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...new_props} />
            </Router>
        );

        expect(mockFn).toHaveBeenCalled();
    });
});
