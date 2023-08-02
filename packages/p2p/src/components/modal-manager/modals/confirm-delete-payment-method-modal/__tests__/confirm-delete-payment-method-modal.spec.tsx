import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import ConfirmDeletePaymentMethodModal from '../confirm-delete-payment-method-modal';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_profile_store: {
        payment_method_to_delete: {
            display_name: 'test name',
        },
        onClickDelete: jest.fn(),
    },
};

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

const el_modal = document.createElement('div');

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<ConfirmDeletePaymentMethodModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the ConfirmDeletePaymentMethodModal', () => {
        render(<ConfirmDeletePaymentMethodModal />);

        expect(screen.getByText('Delete test name?')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to remove this payment method?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Yes, remove' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    });

    it('should call onClickDelete when deleting a payment method', () => {
        render(<ConfirmDeletePaymentMethodModal />);

        const remove_button = screen.getByRole('button', { name: 'Yes, remove' });
        userEvent.click(remove_button);

        expect(mock_store.my_profile_store.onClickDelete).toHaveBeenCalledTimes(1);
    });

    it('should call hideModal when user clicks No', () => {
        render(<ConfirmDeletePaymentMethodModal />);

        const no_button = screen.getByRole('button', { name: 'No' });
        userEvent.click(no_button);

        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
    });
});
