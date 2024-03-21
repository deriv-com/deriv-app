import React from 'react';
import { useOrderDetails } from '@/pages/orders/screens/OrderDetails/OrderDetailsProvider';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import OrderDetailsCardHeader from '../OrderDetailsCardHeader';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/pages/orders/screens/OrderDetails/OrderDetailsProvider', () => ({
    useOrderDetails: jest.fn().mockReturnValue({
        orderDetails: {
            displayPaymentAmount: '0.10',
            hasTimerExpired: false,
            id: '123',
            isBuyerConfirmedOrder: true,
            isPendingOrder: true,
            local_currency: 'USD',
            orderExpiryMilliseconds: 12345567,
            shouldHighlightAlert: false,
            shouldHighlightDanger: true,
            shouldHighlightSuccess: false,
            shouldShowOrderTimer: true,
            statusString: 'Pay now',
        },
    }),
}));

jest.mock('../../../OrderTimer', () => ({
    OrderTimer: () => <div>OrderTimer</div>,
}));

const mockUseOrderDetails = useOrderDetails as jest.Mock;

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

describe('<OrderDetailsCardHeader />', () => {
    it('should show status with error class, the order ID and time left', () => {
        render(<OrderDetailsCardHeader />, { wrapper });

        const statusText = screen.getByText('Pay now');

        expect(statusText).toBeInTheDocument();
        expect(statusText).toHaveClass('derivs-text__color--error');
        expect(screen.getByText('Order ID 123')).toBeInTheDocument();
        expect(screen.getByText('Time left')).toBeInTheDocument();
        expect(screen.getByText('OrderTimer')).toBeInTheDocument();
    });

    it('should show status with success class', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldHighlightDanger: false,
                shouldHighlightSuccess: true,
                statusString: 'Completed',
            },
        });

        render(<OrderDetailsCardHeader />, { wrapper });

        const statusText = screen.getByText('Completed');

        expect(statusText).toBeInTheDocument();
        expect(statusText).toHaveClass('derivs-text__color--success');
    });

    it('should show status with warning class', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldHighlightAlert: true,
                shouldHighlightSuccess: false,
                statusString: 'Waiting for seller to confirm',
            },
        });

        render(<OrderDetailsCardHeader />, { wrapper });

        const statusText = screen.getByText('Waiting for seller to confirm');

        expect(statusText).toBeInTheDocument();
        expect(statusText).toHaveClass('derivs-text__color--warning');
    });

    it('should show status with less-prominent class and hide timer if shouldShowOrderTimer is false', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldHighlightAlert: false,
                shouldShowOrderTimer: false,
                statusString: 'Expired',
            },
        });

        render(<OrderDetailsCardHeader />, { wrapper });

        const statusText = screen.getByText('Expired');

        expect(statusText).toBeInTheDocument();
        expect(statusText).toHaveClass('derivs-text__color--less-prominent');
        expect(screen.queryByText('Time left')).not.toBeInTheDocument();
        expect(screen.queryByText('OrderTimer')).not.toBeInTheDocument();
    });
});
