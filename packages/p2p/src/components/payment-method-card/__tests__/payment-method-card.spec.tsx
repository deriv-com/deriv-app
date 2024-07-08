import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PaymentMethodCard from '../payment-method-card';

const payment_method_card_props = {
    id: '1',
    display_name: 'test',
    fields: {
        account: {
            display_name: 'test_account',
            required: 1,
            type: 'text',
            value: 'account',
        },
        bank_name: {
            display_name: 'test_bank_name',
            required: 1,
            type: 'text',
            value: 'maybank',
        },
    },
    is_enabled: 1,
    method: '',
};

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        payment_method_ids: [1],
    },
    my_profile_store: {
        setPaymentMethodToEdit: jest.fn(),
        setSelectedPaymentMethodDisplayName: jest.fn(),
        setShouldShowEditPaymentMethodForm: jest.fn(),
    },
};

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
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
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<PaymentMethodCard />', () => {
    it('should render the PaymentMethodCard component', () => {
        render(<PaymentMethodCard payment_method={payment_method_card_props} />, { wrapper });

        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('maybank')).toBeInTheDocument();
        expect(screen.getByText('account')).toBeInTheDocument();
        expect(screen.getByTestId('dt_dropdown_container')).toBeInTheDocument();
    });

    it('should render add PaymentMethodCard component if is_add is true', () => {
        render(<PaymentMethodCard is_add label='test add' />, { wrapper });

        expect(screen.getByTestId('dt_payment_method_card_add_icon')).toBeInTheDocument();
        expect(screen.getByText('test add')).toBeInTheDocument();
    });

    it('should call setPaymentMethodToEdit, setSelectedPaymentMethodDisplayName, setShouldShowEditPaymentMethodForm if Edit is pressed', async () => {
        render(<PaymentMethodCard payment_method={payment_method_card_props} />, { wrapper });

        const dropdown = screen.getByTestId('dt_dropdown_display');
        userEvent.click(dropdown);

        await waitFor(() => {
            userEvent.click(screen.getByText('Edit'));
        });

        expect(mock_store.my_profile_store.setPaymentMethodToEdit).toHaveBeenCalled();
        expect(mock_store.my_profile_store.setSelectedPaymentMethodDisplayName).toHaveBeenCalled();
        expect(mock_store.my_profile_store.setShouldShowEditPaymentMethodForm).toBeCalledWith(true);
    });

    it('should call showModal if Delete is pressed', async () => {
        render(<PaymentMethodCard payment_method={payment_method_card_props} />, { wrapper });

        const dropdown = screen.getByTestId('dt_dropdown_display');
        userEvent.click(dropdown);

        await waitFor(() => {
            userEvent.click(screen.getByText('Delete'));
        });

        expect(mock_modal_manager.showModal).toBeCalledWith({
            key: 'DeletePaymentMethodConfirmationModal',
            props: {
                payment_method_id: '1',
                payment_method_name: 'maybank',
            },
        });
    });
});
