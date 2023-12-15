import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AddPaymentMethod from '../add-payment-method';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        active_index: 3,
        formik_ref: {
            dirty: false,
        },
        setFormikRef: jest.fn(),
    },
    my_profile_store: {
        hideAddPaymentMethodForm: jest.fn(),
        payment_methods_list_items: [{ text: 'Alipay', value: 'alipay' }],
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

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    </APIProvider>
);

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<AddPaymentMethod />', () => {
    it('should render the AddPaymentMethod component', () => {
        render(<AddPaymentMethod />, { wrapper });

        expect(screen.getByTestId('dt_page_return_icon')).toBeInTheDocument();
        expect(screen.getByText('Add payment method')).toBeInTheDocument();
        expect(screen.getByLabelText('Alipay ID')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('should call showModal when clicking page return icon if selected_payment_method or dirty is true', () => {
        mock_store.general_store.formik_ref.dirty = true;

        render(<AddPaymentMethod />, { wrapper });

        const pageReturnIcon = screen.getByTestId('dt_page_return_icon');

        userEvent.click(pageReturnIcon);

        expect(mock_modal_manager.showModal).toBeCalledWith({ key: 'CancelAddPaymentMethodModal', props: {} });
    });

    it('should call hideModal, hideAddPaymentMethodForm when clicking page return icon if selected_payment_method and dirty is false', () => {
        mock_store.general_store.formik_ref.dirty = false;
        mock_store.my_profile_store.selected_payment_method = '';

        render(<AddPaymentMethod />, { wrapper });

        const pageReturnIcon = screen.getByTestId('dt_page_return_icon');

        userEvent.click(pageReturnIcon);

        expect(mock_store.my_profile_store.hideAddPaymentMethodForm).toBeCalled();
        expect(mock_modal_manager.hideModal).toBeCalled();
    });
});
