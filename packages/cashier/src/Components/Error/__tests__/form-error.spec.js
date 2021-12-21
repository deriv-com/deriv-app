import React from 'react';
import FormError from '../form-error';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { routes } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<FormError />', () => {
    const portalRoot = global.document.createElement('div');
    portalRoot.setAttribute('id', 'modal_root');
    global.document.body.appendChild(portalRoot);

    it('should render an <ErrorForm />, when the error.code is equal to "Fiat2CryptoTransferOverLimit"', () => {
        render(<FormError error={{ code: 'Fiat2CryptoTransferOverLimit', message: 'Error is occured' }} />);
        expect(screen.getByText('Please verify your identity')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Verify identity')).toBeInTheDocument();
    });

    it('in case of error.code is equal to "Fiat2CryptoTransferOverLimit", should redirect to "/account/proof-of-identity" page, when confirm button is clicked', () => {
        const error = {
            code: 'Fiat2CryptoTransferOverLimit',
            message: 'Error is occured',
            setErrorMessage(value) {
                this.message = value;
            },
        };
        const history = createBrowserHistory();
        const expected_route = 'proof_of_identity';

        render(
            <Router history={history}>
                <FormError error={error} />
            </Router>
        );
        const on_cancel_on_confirm_btns = screen.getAllByRole('button');
        const [on_cancel_btn, on_confirm_btn] = on_cancel_on_confirm_btns;
        fireEvent.click(on_confirm_btn);
        expect(history.location.pathname).toBe(routes[expected_route]);
        expect(error.message).toBe('');
    });

    it('in case of error.code is equal to "Fiat2CryptoTransferOverLimit", <ErrorForm /> component should not be visible, when "Cancel" button is clicked', async () => {
        const error = {
            code: 'Fiat2CryptoTransferOverLimit',
            message: 'Error is occured',
            setErrorMessage(value) {
                this.message = value;
            },
        };

        render(<FormError error={error} />);

        const on_cancel_on_confirm_btns = screen.getAllByRole('button');
        const [on_cancel_btn, on_confirm_btn] = on_cancel_on_confirm_btns;
        fireEvent.click(on_cancel_btn);
        await waitFor(() => {
            expect(screen.queryByText('Please verify your identity')).not.toBeInTheDocument();
        });
    });
});
