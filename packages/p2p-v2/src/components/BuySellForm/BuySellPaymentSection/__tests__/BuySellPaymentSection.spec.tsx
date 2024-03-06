import React from 'react';
import { PaymentMethodCard } from '@/components/PaymentMethodCard';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySellPaymentSection from '../BuySellPaymentSection';

const mockProps = {
    availablePaymentMethods: [],
    onSelectPaymentMethodCard: jest.fn(),
    selectedPaymentMethodIds: ['123'],
};

const mockAvailablePaymentMethods = {
    display_name: 'Other',
    fields: {
        account: {
            display_name: 'Account ID / phone number / email',
            required: 0,
            type: 'text',
        },
        instructions: {
            display_name: 'Instructions',
            required: 0,
            type: 'memo',
        },
        name: {
            display_name: 'Payment method name',
            required: 1,
            type: 'text',
        },
    },
    id: '67',
    isAvailable: true,
    type: 'other',
};
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const mockPaymentMethodCard = PaymentMethodCard as jest.MockedFunction<typeof PaymentMethodCard>;

describe('BuySellPaymentSection', () => {
    it('should render the component as expected', () => {
        render(<BuySellPaymentSection {...mockProps} />);
        expect(screen.getByText('Receive payment to')).toBeInTheDocument();
    });
    it('should render the payment method cards when there are available payment methods', () => {
        render(<BuySellPaymentSection {...mockProps} availablePaymentMethods={[mockAvailablePaymentMethods]} />);
        expect(screen.getByText('Receive payment to')).toBeInTheDocument();
        expect(screen.getByText('You may choose up to 3.')).toBeInTheDocument();
        expect(screen.getByText('Other')).toBeInTheDocument();
        const checkbox = screen.getByRole('checkbox');
        userEvent.click(checkbox);
        expect(mockProps.onSelectPaymentMethodCard).toBeCalledWith(67);
    });
});
