import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import DeletePaymentMethodErrorModal from '../delete-payment-method-error-modal';

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

const el_modal = document.createElement('div');

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<DeletePaymentMethodErrorModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the DeletePaymentMethodErrorModal', () => {
        render(<DeletePaymentMethodErrorModal error_message='error message' />);

        expect(screen.getByText('That payment method cannot be deleted')).toBeInTheDocument();
        expect(screen.getByText('error message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ok' })).toBeInTheDocument();
    });

    it('should call hideModal when clicking on the Ok button', () => {
        render(<DeletePaymentMethodErrorModal error_message='error message' />);

        const ok_button = screen.getByRole('button', { name: 'Ok' });
        userEvent.click(ok_button);

        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
    });
});
