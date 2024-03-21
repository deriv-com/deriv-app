import React from 'react';
import { useOrderDetails } from '@/pages/orders/screens/OrderDetails/OrderDetailsProvider';
import { render, screen } from '@testing-library/react';
import OrderDetailsCardFooter from '../OrderDetailsCardFooter';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/pages/orders/screens/OrderDetails/OrderDetailsProvider', () => ({
    useOrderDetails: jest.fn().mockReturnValue({
        orderDetails: {
            shouldShowCancelAndPaidButton: true,
            shouldShowComplainAndReceivedButton: false,
            shouldShowOnlyComplainButton: false,
            shouldShowOnlyReceivedButton: false,
        },
    }),
}));

const mockUseOrderDetails = useOrderDetails as jest.Mock;

describe('<OrderDetailsCardFooter />', () => {
    it('should render cancel and paid buttons', () => {
        render(<OrderDetailsCardFooter />);
        expect(screen.getByRole('button', { name: 'Cancel order' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'I’ve paid' })).toBeInTheDocument();
    });

    it('should render complain and received buttons', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowCancelAndPaidButton: false,
                shouldShowComplainAndReceivedButton: true,
            },
        });

        render(<OrderDetailsCardFooter />);

        expect(screen.getByRole('button', { name: 'Complain' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'I’ve received payment' })).toBeInTheDocument();
    });

    it('should render only complain button', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowComplainAndReceivedButton: false,
                shouldShowOnlyComplainButton: true,
            },
        });

        render(<OrderDetailsCardFooter />);

        expect(screen.getByRole('button', { name: 'Complain' })).toBeInTheDocument();
    });

    it('should render only received button', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowOnlyComplainButton: false,
                shouldShowOnlyReceivedButton: true,
            },
        });

        render(<OrderDetailsCardFooter />);

        expect(screen.getByRole('button', { name: 'I’ve received payment' })).toBeInTheDocument();
    });

    it('should not render any buttons', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowOnlyReceivedButton: false,
            },
        });

        const { container } = render(<OrderDetailsCardFooter />);

        expect(container).toBeEmptyDOMElement();
    });
});
