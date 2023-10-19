import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores/index';
import ConfirmDeletePaymentMethodModal from '../confirm-delete-payment-method-modal';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_profile_store: {
        payment_method_to_delete: {
            display_name: 'test',
        },
    },
};

const el_modal = document.createElement('div');

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        hideModal: jest.fn(),
        is_modal_open: true,
    })),
}));

describe('<ConfirmDeletePaymentMethodModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render ConfirmDeletePaymentMethodModal', () => {
        render(<ConfirmDeletePaymentMethodModal />);

        expect(screen.getByText('Delete test?')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to remove this payment method?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Yes, remove' }));
        expect(screen.getByRole('button', { name: 'No' }));
    });
});
