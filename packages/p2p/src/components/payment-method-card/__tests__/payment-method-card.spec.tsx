import React from 'react';
import { screen, render, waitFor, getByTestId } from '@testing-library/react';
import { useStores } from 'Stores/index';
import PaymentMethodCard from '../payment-method-card';
import userEvent from '@testing-library/user-event';

const payment_method_card_props = {
    ID: '1',
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
    general_store: {
        active_index: 0,
    },
    my_ads_store: {
        payment_method_ids: [1],
    },
    my_profile_store: {
        onEditDeletePaymentMethodCard: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<PaymentMethodCard />', () => {
    it('should render the PaymentMethodCard component', () => {
        render(<PaymentMethodCard payment_method={payment_method_card_props} />);

        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('maybank')).toBeInTheDocument();
        expect(screen.getByText('account')).toBeInTheDocument();
        expect(screen.getByTestId('dt_dropdown_container')).toBeInTheDocument();
    });

    it('should render add PaymentMethodCard component if is_add is true', () => {
        render(<PaymentMethodCard is_add label='test add' />);

        expect(screen.getByTestId('dt_payment_method_card_add_icon')).toBeInTheDocument();
        expect(screen.getByText('test add')).toBeInTheDocument();
    });

    it('should call onEditDeletePaymentMethodCard when clicking on dropdown', async () => {
        let deleteOption;

        render(<PaymentMethodCard payment_method={payment_method_card_props} />);

        const dropdown = screen.getByTestId('dti_dropdown_display');
        userEvent.click(dropdown);

        await waitFor(() => {
            deleteOption = screen.getByText('Delete');
            userEvent.click(deleteOption);
        });

        expect(mock_store.my_profile_store.onEditDeletePaymentMethodCard).toHaveBeenCalled();
    });
});
