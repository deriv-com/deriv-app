import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderDetailsCardInfo from '../OrderDetailsCardInfo';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/pages/orders/screens/OrderDetails/OrderDetailsProvider', () => ({
    useOrderDetails: jest.fn().mockReturnValue({
        orderDetails: {
            account_currency: 'USD',
            advertiser_details: { name: 'Johnny123' },
            amount_display: '100',
            displayPaymentAmount: '110',
            labels: {
                counterpartyNicknameLabel: 'Seller’s nickname',
                counterpartyRealNameLabel: 'Seller’s real name',
                leftSendOrReceive: 'Send',
                paymentDetails: 'Payment details',
                rightSendOrReceive: 'Receive',
            },
            local_currency: 'IDR',
            otherUserDetails: { first_name: 'John', last_name: 'Doe' },
            purchaseTime: '2021-09-01 12:00:00',
            rateAmount: '10',
        },
    }),
}));

jest.mock('../ActiveOrderInfo', () => ({
    ActiveOrderInfo: () => <div>ActiveOrderInfo</div>,
}));

describe('<OrderDetailsCardInfo />', () => {
    it('should render order details info', () => {
        render(<OrderDetailsCardInfo />);

        expect(screen.getByText('Seller’s nickname')).toBeInTheDocument();
        expect(screen.getByText('Johnny123')).toBeInTheDocument();

        expect(screen.getByText('Seller’s real name')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();

        expect(screen.getByText('Send')).toBeInTheDocument();
        expect(screen.getByText('110 IDR')).toBeInTheDocument();

        expect(screen.getByText('Receive')).toBeInTheDocument();
        expect(screen.getByText('100 USD')).toBeInTheDocument();

        expect(screen.getByText('Rate (1 USD)')).toBeInTheDocument();
        expect(screen.getByText('10 IDR')).toBeInTheDocument();

        expect(screen.getByText('Time')).toBeInTheDocument();
        expect(screen.getByText('2021-09-01 12:00:00')).toBeInTheDocument();

        expect(screen.getByText('ActiveOrderInfo')).toBeInTheDocument();
    });
});
