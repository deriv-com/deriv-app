import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeletePaymentMethodConfirmationModal from '../delete-payment-method-confirmation-modal';

const mock_modal_manager_context = {
    hideModal: jest.fn(),
    is_modal_open: true,
    showModal: jest.fn(),
};

const mock_p2p_advertiser_payment_methods_hooks = {
    delete: jest.fn(),
    mutation: {
        error: undefined,
        status: 'idle',
    },
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: () => mock_modal_manager_context,
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PAdvertiserPaymentMethods: jest.fn(() => mock_p2p_advertiser_payment_methods_hooks),
}));

describe('<DeletePaymentMethodConfirmationModal />', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render delete payment method confirmation modal', () => {
        render(<DeletePaymentMethodConfirmationModal payment_method_id={1} payment_method_name='Skrill' />);

        expect(screen.getByText('Delete Skrill?')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to remove this payment method?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Yes, remove' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    });

    it('should call delete_payment_method when Yes, remove button is clicked', () => {
        render(<DeletePaymentMethodConfirmationModal payment_method_id={1} payment_method_name='Skrill' />);

        const yes_remove_button = screen.getByRole('button', { name: 'Yes, remove' });
        userEvent.click(yes_remove_button);

        expect(mock_p2p_advertiser_payment_methods_hooks.delete).toHaveBeenCalled();
    });

    it('should close modal when No button is clicked', () => {
        render(<DeletePaymentMethodConfirmationModal payment_method_id={1} payment_method_name='Skrill' />);

        const no_button = screen.getByRole('button', { name: 'No' });
        userEvent.click(no_button);

        expect(mock_modal_manager_context.hideModal).toHaveBeenCalled();
    });
});
