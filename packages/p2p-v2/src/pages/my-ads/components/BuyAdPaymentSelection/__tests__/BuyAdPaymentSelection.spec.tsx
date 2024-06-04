import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuyAdPaymentSelection from '../BuyAdPaymentSelection';

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        paymentMethods: {
            useGet: () => ({
                data: [
                    {
                        display_name: 'Bank Transfer',
                        fields: {
                            account: {
                                display_name: 'Account Number',
                                required: 1,
                                type: 'text',
                                value: 'Account Number',
                            },
                            bank_name: { display_name: 'Bank Transfer', required: 1, type: 'text', value: 'Bank Name' },
                        },
                        id: 'test1',
                        is_enabled: 0,
                        method: '',
                        type: 'bank',
                        used_by_adverts: null,
                        used_by_orders: null,
                    },
                    {
                        display_name: 'Ali pay',
                        fields: {
                            account: {
                                display_name: 'Account Number',
                                required: 1,
                                type: 'text',
                                value: 'Account Number',
                            },
                            bank_name: { display_name: 'Ali pay', required: 1, type: 'text', value: 'Bank Name' },
                        },
                        id: 'test2',
                        is_enabled: 0,
                        method: '',
                        type: 'wallet',
                        used_by_adverts: null,
                        used_by_orders: null,
                    },
                    {
                        display_name: 'Skrill',
                        fields: {
                            account: {
                                display_name: 'Account Number',
                                required: 1,
                                type: 'text',
                                value: 'Account Number',
                            },
                            bank_name: { display_name: 'Skrill', required: 1, type: 'text', value: 'Bank Name' },
                        },
                        id: 'test3',
                        is_enabled: 0,
                        method: '',
                        type: 'wallet',
                        used_by_adverts: null,
                        used_by_orders: null,
                    },
                ],
            }),
        },
    },
}));

jest.mock('../../BuyPaymentMethodsList', () => ({
    BuyPaymentMethodsList: () => <div>BuyPaymentMethodsList</div>,
}));

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    PaymentMethodWithIcon: () => <div>PaymentMethodWithIcon</div>,
}));

const mockProps = {
    onSelectPaymentMethod: jest.fn(),
    selectedPaymentMethods: [],
};

describe('BuyAdPaymentSelection', () => {
    it('should render the buy ad payment selection component', () => {
        render(<BuyAdPaymentSelection {...mockProps} />);
        expect(screen.getByText('BuyPaymentMethodsList')).toBeInTheDocument();
    });
    it('should not render the dropdown if 3 payment methods are selected', () => {
        render(<BuyAdPaymentSelection {...mockProps} selectedPaymentMethods={['test', 'test1', 'test2']} />);
        expect(screen.queryByPlaceholderText('BuyPaymentMethodsList')).not.toBeInTheDocument();
    });
    it('should render the delete button for each selected payment method', () => {
        render(<BuyAdPaymentSelection {...mockProps} selectedPaymentMethods={['test']} />);
        expect(screen.getByText('PaymentMethodWithIcon')).toBeInTheDocument();
        const button = screen.getByTestId('dt_p2p_v2_payment_delete_icon');
        userEvent.click(button);
        expect(mockProps.onSelectPaymentMethod).toHaveBeenCalledWith('test', 'delete');
    });
});
