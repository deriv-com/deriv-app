import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import SelectPaymentMethod from '../select-payment-method';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<SelectPaymentMethod />', () => {
    beforeEach(() => {
        mock_store = {
            my_profile_store: {
                getPaymentMethodsList: jest.fn(),
                payment_methods_list_items: [
                    { text: 'Alipay', value: 'alipay' },
                    { text: 'Bank Transfer', value: 'bank_transfer' },
                    { text: 'Other', value: 'other' },
                ],
                setSelectedPaymentMethod: jest.fn(),
            },
        };
    });

    it('should render the SelectPaymentMethod component', () => {
        render(<SelectPaymentMethod />);

        expect(screen.getByLabelText('Payment method')).toBeInTheDocument();
        expect(screen.getByText('Don’t see your payment method?')).toBeInTheDocument();
        expect(screen.getByText('Add new.')).toBeInTheDocument();
    });

    it('should render the Loading component if payment_methods_list_items is empty', () => {
        mock_store.my_profile_store.payment_methods_list_items = [];

        render(<SelectPaymentMethod />);

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should call setSelectedPaymentMethod when clicking on Add new link', () => {
        render(<SelectPaymentMethod />);

        const addNewLink = screen.getByText('Add new.');

        userEvent.click(addNewLink);

        expect(mock_store.my_profile_store.setSelectedPaymentMethod).toBeCalledWith('other');
    });

    it('should call setSelectedPaymentMethod when clicking selecting payment method', async () => {
        render(<SelectPaymentMethod />);

        let aliPayDropdownOption;
        const paymentMethodDropdown = screen.getByLabelText('Payment method');

        userEvent.click(paymentMethodDropdown);

        await waitFor(() => {
            aliPayDropdownOption = screen.getByText('Alipay');

            userEvent.click(aliPayDropdownOption);
        });

        await waitFor(() => expect(mock_store.my_profile_store.setSelectedPaymentMethod).toBeCalled());
    });
});
