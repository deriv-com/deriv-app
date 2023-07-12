import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AddPaymentMethodForm from '../add-payment-method-form';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    showModal: jest.fn(),
    modal: {},
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<AddPaymentMethodForm />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                active_index: 3,
                setFormikRef: jest.fn(),
            },
            my_profile_store: {
                createPaymentMethod: jest.fn(),
                getPaymentMethodsList: jest.fn(),
                getSelectedPaymentMethodDetails: jest.fn(),
                hideAddPaymentMethodForm: jest.fn(),
                initial_values: { account: '', instructions: '' },
                selected_payment_method_display_name: 'Alipay',
                selected_payment_method_fields: [
                    { 0: 'account', 1: { display_name: 'Alipay ID', required: 1, type: 'text' } },
                    { 0: 'instructions', 1: { display_name: 'Instructions', required: 0, type: 'memo' } },
                ],
                selected_payment_method: 'alipay',
                setAddPaymentMethodErrorMessage: jest.fn(),
                setSelectedPaymentMethod: jest.fn(),
                validatePaymentMethodFields: jest.fn(),
            },
        };
    });

    it('should render AddPaymentMethodForm component', () => {
        render(<AddPaymentMethodForm />);

        expect(screen.getByText('Choose your payment method')).toBeInTheDocument();
        expect(screen.getByLabelText('Alipay ID')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('should render Loading component', () => {
        mock_store.my_profile_store.selected_payment_method_display_name = '';
        mock_store.my_profile_store.selected_payment_method_fields = [];

        render(<AddPaymentMethodForm />);

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should call setSelectedPaymentMethod when clicking on cross icon', () => {
        render(<AddPaymentMethodForm />);

        const crossIcon = screen.getByTestId('dt_add_payment_method_form_cross_icon');

        userEvent.click(crossIcon);

        expect(mock_store.my_profile_store.setSelectedPaymentMethod).toBeCalledWith('');
    });

    it('should call showModal if input fields are not empty when clicking Cancel button', async () => {
        render(<AddPaymentMethodForm />);

        const alipayIdInput = screen.getByLabelText('Alipay ID');
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });

        userEvent.type(alipayIdInput, '123');

        await waitFor(() => userEvent.click(cancelButton));

        await waitFor(() =>
            expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'CancelAddPaymentMethodModal' })
        );
    });

    it('should call hideAddPaymentMethodForm and hideModal if fields are empty when clicking Cancel button', () => {
        mock_store.my_profile_store.selected_payment_method = '';
        render(<AddPaymentMethodForm />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });

        userEvent.click(cancelButton);

        expect(mock_store.my_profile_store.hideAddPaymentMethodForm).toHaveBeenCalled();
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });
});
