import React from 'react';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActiveOrderInfo from '../ActiveOrderInfo';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/providers/OrderDetailsProvider', () => ({
    useOrderDetails: jest.fn().mockReturnValue({
        orderDetails: {
            advert_details: {
                description: 'This is my description',
            },
            contact_info: 'This is my contact info',
            isActiveOrder: true,
            labels: {
                contactDetails: 'Seller’s contact details',
                instructions: 'Seller’s instructions',
                paymentDetails: 'Seller’s payment details',
            },
            payment_info: 'This is my payment info',
            payment_method_details: {
                '1': {
                    display_name: 'Alipay',
                    fields: {
                        account: {
                            display_name: 'Alipay ID',
                            required: 1,
                            type: 'text',
                            value: '12345',
                        },
                        instructions: {
                            display_name: 'Instructions',
                            required: 0,
                            type: 'memo',
                            value: 'Alipay instructions',
                        },
                    },
                    is_enabled: 1,
                    method: 'alipay',
                    type: 'ewallet',
                },
            },
        },
    }),
}));

const mockUseOrderDetails = useOrderDetails as jest.Mock;

describe('<ActiveOrderInfo />', () => {
    it('should render the payment methods, payment details and instructions', () => {
        render(<ActiveOrderInfo />);

        expect(screen.getByText('Seller’s payment details')).toBeInTheDocument();
        expect(screen.getByText('Expand all')).toBeInTheDocument();
        expect(screen.getByText('Alipay')).toBeInTheDocument();

        expect(screen.getByText('Seller’s contact details')).toBeInTheDocument();
        expect(screen.getByText('This is my contact info')).toBeInTheDocument();

        expect(screen.getByText('Seller’s instructions')).toBeInTheDocument();
        expect(screen.getByText('This is my description')).toBeInTheDocument();
    });

    it('should show the expanded view of payment method details after clicking on a payment method and hide it after clicking on it again', () => {
        render(<ActiveOrderInfo />);

        const alipayMethod = screen.getByText('Alipay');
        userEvent.click(alipayMethod);

        expect(screen.getByText('Alipay ID')).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByText('Alipay instructions')).toBeInTheDocument();

        userEvent.click(alipayMethod);

        expect(screen.queryByText('Alipay ID')).not.toBeInTheDocument();
        expect(screen.queryByText('12345')).not.toBeInTheDocument();
        expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
        expect(screen.queryByText('Alipay instructions')).not.toBeInTheDocument();
    });

    it('should show the expanded view of payment method details after clicking on expand all and hide it after clicking the button again', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                payment_method_details: {
                    ...mockUseOrderDetails().orderDetails.payment_method_details,
                    '2': {
                        display_name: 'Bank transfer',
                        fields: {
                            account: {
                                display_name: 'Account Number',
                                required: 1,
                                type: 'text',
                                value: '54321',
                            },
                            instructions: {
                                display_name: 'Bank Name',
                                required: 0,
                                type: 'memo',
                                value: 'test bank',
                            },
                        },
                        is_enabled: 1,
                        method: 'alipay',
                        type: 'ewallet',
                    },
                },
            },
        });

        render(<ActiveOrderInfo />);

        const expandAllButton = screen.getByRole('button', { name: 'Expand all' });
        userEvent.click(expandAllButton);

        expect(screen.getByText('Alipay ID')).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByText('Alipay instructions')).toBeInTheDocument();

        expect(screen.getByText('Account Number')).toBeInTheDocument();
        expect(screen.getByText('54321')).toBeInTheDocument();
        expect(screen.getByText('Bank Name')).toBeInTheDocument();
        expect(screen.getByText('test bank')).toBeInTheDocument();

        const collapseAllButton = screen.getByRole('button', { name: 'Collapse all' });

        expect(collapseAllButton).toBeInTheDocument();
        userEvent.click(collapseAllButton);

        expect(screen.queryByText('Alipay ID')).not.toBeInTheDocument();
        expect(screen.queryByText('12345')).not.toBeInTheDocument();
        expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
        expect(screen.queryByText('Alipay instructions')).not.toBeInTheDocument();

        expect(screen.queryByText('Account Number')).not.toBeInTheDocument();
        expect(screen.queryByText('54321')).not.toBeInTheDocument();
        expect(screen.queryByText('Bank Name')).not.toBeInTheDocument();
        expect(screen.queryByText('test bank')).not.toBeInTheDocument();
    });

    it('should return null if isActiveOrder is false', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: { ...mockUseOrderDetails().orderDetails, isActiveOrder: false },
        });

        const { container } = render(<ActiveOrderInfo />);

        expect(container).toBeEmptyDOMElement();
    });
});
