import React from 'react';
import ErrorDialog from '../error-dialog';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { routes } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<ErrorDialog />', () => {
    let modal_root_el;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should show "Please verify your identity" message, "Cancel" and "Verify identity" buttons', () => {
        render(<ErrorDialog error={{ code: 'Fiat2CryptoTransferOverLimit', message: 'Error is occured' }} />);

        expect(screen.getByText('Please verify your identity')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Verify identity')).toBeInTheDocument();
    });

    it('should redirect to "/account/proof-of-identity" page, when "Verify identity" button was clicked', () => {
        const history = createBrowserHistory();
        const setErrorMessage = jest.fn();
        const error = {
            code: 'Fiat2CryptoTransferOverLimit',
            message: 'Error is occured',
            setErrorMessage,
        };
        render(
            <Router history={history}>
                <ErrorDialog error={error} />
            </Router>
        );
        const on_confirm_btn = screen.getByText('Verify identity');
        fireEvent.click(on_confirm_btn);

        expect(history.location.pathname).toBe(routes.proof_of_identity);
    });

    it('should show "Cashier Error" message and "OK" button', () => {
        render(<ErrorDialog error={{ code: '', message: 'Error is occured' }} />);

        expect(screen.getByText('Cashier Error')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('should not show "Cashier Error" message, when "OK" button was clicked', async () => {
        const setErrorMessage = jest.fn();
        const error = {
            code: '',
            message: 'Error is occured',
            setErrorMessage,
        };
        render(<ErrorDialog error={error} />);
        const ok_btn = screen.getByText('OK');
        fireEvent.click(ok_btn);

        await waitFor(() => {
            expect(screen.queryByText('Error is occured')).not.toBeInTheDocument();
        });
    });

    it('should not show "Please verify your identity" message, when "Cancel" button was clicked', async () => {
        const setErrorMessage = jest.fn();
        const error = {
            code: 'Fiat2CryptoTransferOverLimit',
            message: 'Error is occured',
            setErrorMessage,
        };
        render(<ErrorDialog error={error} />);
        const cancel_btn = screen.getByText('Cancel');
        fireEvent.click(cancel_btn);

        await waitFor(() => {
            expect(screen.queryByText('Error is occured')).not.toBeInTheDocument();
        });
    });

    it('should clear an error.message if one of the buttons ["Verify identity", "Cancel", "OK"] was clicked', () => {
        const checkButton = (error_code, btn_name) => {
            const history = createBrowserHistory();
            const error = {
                code: error_code,
                message: 'Error is occured',
                setErrorMessage({ code, message }) {
                    this.message = message;
                },
            };
            const { unmount } = render(
                <Router history={history}>
                    <ErrorDialog error={error} />
                </Router>
            );
            const error_btn = screen.getByText(btn_name);
            fireEvent.click(error_btn);

            expect(error.message).toBe('');

            unmount();
        };

        checkButton('Fiat2CryptoTransferOverLimit', 'Verify identity');
        checkButton('Fiat2CryptoTransferOverLimit', 'Cancel');
        checkButton('', 'OK');
    });
});
