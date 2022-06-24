import React from 'react';
import { screen, render, act, fireEvent, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import ResetTradingPasswordModal from '../reset-trading-password-modal';
import { WS } from '@deriv/shared';

const mock_promise = Promise.resolve();

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

describe('<ResetTradingPasswordModal/>', () => {
    const props = {
        disableApp: jest.fn(),
        enableApp: jest.fn(),
        toggleResetTradingPasswordModal: jest.fn(),
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

    it('should render dialog title to specific CFDPlatform label', async () => {
        WS.tradingPlatformPasswordReset.mockReturnValue(
            Promise.resolve({ error: { message: 'Test error', code: 'InvalidToken' } })
        );
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );

        await waitForElementToBeRemoved(() => screen.getByTestId('dt_initial_loader'));
        fireEvent.change(screen.getByLabelText('DMT5 password', { selector: 'input' }), {
            target: { value: 'hN795jCWkDtPy5' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));

        expect(await screen.findByText('Reset DMT5 password')).toBeInTheDocument();
    });

    it('should display error message returned by API', async () => {
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.getByTestId('dt_initial_loader'));

        fireEvent.change(screen.getByLabelText('DMT5 password', { selector: 'input' }), {
            target: { value: 'hN795jCWkDtPy5' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));

        expect(await screen.findByText('Test error')).toBeInTheDocument();
        expect(
            await screen.findByText('Please request a new password and check your email for the new token.')
        ).toBeInTheDocument();
    });

    it('should get the account status on successful submission', async () => {
        WS.tradingPlatformPasswordReset.mockReturnValue(Promise.resolve({ data: 'Test data' }));
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );

        await waitForElementToBeRemoved(() => screen.getByTestId('dt_initial_loader'));
        fireEvent.change(screen.getByLabelText('DMT5 password', { selector: 'input' }), {
            target: { value: 'hN795jCWkDtPy5' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Create/i }));

        await waitFor(() => {
            expect(WS.getAccountStatus).toHaveBeenCalled();
        });
    });

    it('should display the password in text format when visibility icon clicked', async () => {
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.getByTestId('dt_initial_loader'));
        fireEvent.change(screen.getByLabelText('DMT5 password', { selector: 'input' }), {
            target: { value: 'hN795jCWkDtPy5' },
        });

        fireEvent.click(screen.getByTestId('dc-password-input__visibility-icon'));
        await waitFor(() => {
            expect(screen.getByDisplayValue('hN795jCWkDtPy5').getAttribute('type')).toBe('text');
        });
    });

    it('should display the password in hidden format when visibility icon clicked consecutively twice', async () => {
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...props} />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.getByTestId('dt_initial_loader'));
        fireEvent.change(screen.getByLabelText('DMT5 password', { selector: 'input' }), {
            target: { value: 'hN795jCWkDtPy5' },
        });
        fireEvent.click(screen.getByTestId('dc-password-input__visibility-icon'));
        await waitFor(() => {
            fireEvent.click(screen.getByTestId('dc-password-input__visibility-icon'));
            expect(screen.getByDisplayValue('hN795jCWkDtPy5').getAttribute('type')).toBe('text');
        });
    });

    it('should close the dialog when cancel button is clicked', async () => {
        const mockFn = jest.fn();
        const new_props = { ...props, toggleResetTradingPasswordModal: mockFn };
        render(
            <Router history={history}>
                <ResetTradingPasswordModal {...new_props} />
            </Router>
        );
        await waitForElementToBeRemoved(() => screen.getByTestId('dt_initial_loader'));
        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
        await waitFor(() => {
            expect(mockFn).toHaveBeenCalled();
        });
    });
});
