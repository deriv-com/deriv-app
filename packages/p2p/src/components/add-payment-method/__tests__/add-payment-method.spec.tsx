import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores/index';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AddPaymentMethod from '../add-payment-method';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        active_index: 3,
        setFormikRef: jest.fn(),
    },
    my_profile_store: {
        hideAddPaymentMethodForm: jest.fn(),
        selected_payment_method: 'Alipay',
        selected_payment_method_fields: [
            { 0: 'account', 1: { display_name: 'Alipay ID', required: 1, type: 'text' } },
            { 0: 'instructions', 1: { display_name: 'Instructions', required: 0, type: 'memo' } },
        ],
        getPaymentMethodsList: jest.fn(),
        getSelectedPaymentMethodDetails: jest.fn(),
        setAddPaymentMethodErrorMessage: jest.fn(),
    },
};

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    showModal: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<AddPaymentMethod />', () => {
    it('render the AddPaymentMethod component', () => {
        render(<AddPaymentMethod />);

        expect(screen.getByTestId('dt_page_return_icon')).toBeInTheDocument();
        expect(screen.getByText('Add payment method')).toBeInTheDocument();
        expect(screen.getByLabelText('Alipay ID')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });
});
