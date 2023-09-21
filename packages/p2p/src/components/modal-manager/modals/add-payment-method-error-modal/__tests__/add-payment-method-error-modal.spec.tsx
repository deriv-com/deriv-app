import React from 'react';
import { render, screen } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import AddPaymentMethodErrorModal from '../add-payment-method-error-modal';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: { setFormikRef: jest.fn(), setSavedFormState: jest.fn() },
    my_profile_store: {
        add_payment_method_error_message: 'this is the error message',
        setAddPaymentMethodErrorMessage: jest.fn(),
        setSelectedPaymentMethod: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const el_modal = document.createElement('div');

describe('<AddPaymentMethodErrorModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render AddPaymentMethodErrorModal', () => {
        render(<AddPaymentMethodErrorModal />);

        expect(screen.getByText("Something's not right")).toBeInTheDocument();
        expect(screen.getByText('this is the error message')).toBeInTheDocument();
    });
    it('should close the modal on clicking ok button', () => {
        render(<AddPaymentMethodErrorModal />);

        const ok_button = screen.getByRole('button', { name: 'Ok' });
        ok_button.click();
        expect(mock_modal_manager.hideModal).toBeCalledWith({
            should_save_form_history: true,
        });
        expect(mocked_store_values.my_profile_store.setAddPaymentMethodErrorMessage).toBeCalledWith('');
    });
});
