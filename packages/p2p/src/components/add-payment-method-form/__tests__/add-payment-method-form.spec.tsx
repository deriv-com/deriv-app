import React from 'react';
import { screen, render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AddPaymentMethodForm from '../add-payment-method-form';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    isCurrentModal: jest.fn(() => false),
    hideModal: jest.fn(),
    showModal: jest.fn(),
    modal: {},
};

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    </APIProvider>
);

const mock_p2p_advertiser_payment_methods_hooks = {
    create: jest.fn(),
    delete: jest.fn(),
    mutation: {
        error: {
            message: '',
        },
        status: 'idle',
    },
};

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PAdvertiserPaymentMethods: jest.fn(() => mock_p2p_advertiser_payment_methods_hooks),
}));

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
                setShouldShowAddPaymentMethodForm: jest.fn(),
                validatePaymentMethodFields: jest.fn(),
            },
            my_ads_store: {
                should_show_add_payment_method: false,
                setShouldShowAddPaymentMethod: jest.fn(),
            },
        };
    });

    it('should render AddPaymentMethodForm component', () => {
        render(<AddPaymentMethodForm />, { wrapper });

        expect(screen.getByText('Choose your payment method')).toBeInTheDocument();
        expect(screen.getByLabelText('Alipay ID')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('should render Loading component', () => {
        mock_store.my_profile_store.selected_payment_method_display_name = '';
        mock_store.my_profile_store.selected_payment_method_fields = [];

        render(<AddPaymentMethodForm />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should call setSelectedPaymentMethod when clicking on cross icon', () => {
        render(<AddPaymentMethodForm />, { wrapper });

        const crossIcon = screen.getByTestId('dt_add_payment_method_form_cross_icon');

        userEvent.click(crossIcon);

        expect(mock_store.my_profile_store.setSelectedPaymentMethod).toBeCalledWith('');
    });

    it('should call showModal if input fields are not empty when clicking Cancel button', async () => {
        render(<AddPaymentMethodForm />, { wrapper });

        const alipayIdInput = screen.getByLabelText('Alipay ID');
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });

        userEvent.type(alipayIdInput, '123');

        await waitFor(() => userEvent.click(cancelButton));

        await waitFor(() =>
            expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'CancelAddPaymentMethodModal', props: {} })
        );
    });

    it('should call hideAddPaymentMethodForm and hideModal if fields are empty when clicking Cancel button', () => {
        mock_store.my_profile_store.selected_payment_method = '';
        render(<AddPaymentMethodForm />, { wrapper });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });

        userEvent.click(cancelButton);

        expect(mock_store.my_profile_store.hideAddPaymentMethodForm).toHaveBeenCalled();
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });

    it('should call setShouldShowAddPaymentMethodForm, setSelectedPaymentMethod if mutation_status is success', () => {
        mock_p2p_advertiser_payment_methods_hooks.mutation.status = 'success';

        render(<AddPaymentMethodForm />, { wrapper });

        expect(mock_store.my_profile_store.setShouldShowAddPaymentMethodForm).toBeCalledWith(false);
        expect(mock_store.my_profile_store.setSelectedPaymentMethod).toBeCalledWith('');
    });

    it('should call hideModal if mutation_status is success and isCurrentModal is true', () => {
        mock_modal_manager.isCurrentModal = jest.fn(() => true);

        render(<AddPaymentMethodForm />, { wrapper });

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });

    it('should call setShouldShowAddPaymentMethod if should_show_add_payment_method is true and mutation_status is success', () => {
        mock_store.my_ads_store.should_show_add_payment_method = true;

        render(<AddPaymentMethodForm />, { wrapper });

        expect(mock_store.my_ads_store.setShouldShowAddPaymentMethod).toBeCalledWith(false);
    });

    it('should call setAddPaymentMethodErrorMessage and showModal if mutation_status is error', () => {
        mock_p2p_advertiser_payment_methods_hooks.mutation.status = 'error';

        render(<AddPaymentMethodForm />, { wrapper });

        expect(mock_store.my_profile_store.setAddPaymentMethodErrorMessage).toHaveBeenCalled();
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'AddPaymentMethodErrorModal', props: {} });
    });

    it('should call create when clicking on Add button if the form is filled', async () => {
        mock_p2p_advertiser_payment_methods_hooks.mutation.status = 'success';

        render(<AddPaymentMethodForm />, { wrapper });

        const alipayIdInput = screen.getByLabelText('Alipay ID');

        act(() => {
            userEvent.type(alipayIdInput, '123');
        });

        const addButton = screen.getByRole('button', { name: 'Add' });

        act(() => {
            userEvent.click(addButton);
        });

        await waitFor(() => {
            expect(mock_p2p_advertiser_payment_methods_hooks.create).toHaveBeenCalled();
        });
    });
});
