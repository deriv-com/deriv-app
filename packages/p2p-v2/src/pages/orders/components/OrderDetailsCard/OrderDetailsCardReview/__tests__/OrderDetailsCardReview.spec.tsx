import React from 'react';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { render, screen } from '@testing-library/react';
import OrderDetailsCardReview from '../OrderDetailsCardReview';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        settings: {
            useGetSettings: jest.fn(() => ({
                data: { review_period: 24 },
            })),
        },
    },
}));

jest.mock('@/providers/OrderDetailsProvider', () => ({
    useOrderDetails: jest.fn().mockReturnValue({
        orderDetails: {
            completion_time: 1710897035,
            hasReviewDetails: false,
            is_reviewable: true,
            isCompletedOrder: true,
            review_details: undefined,
        },
    }),
}));

const mockUseOrderDetails = useOrderDetails as jest.Mock;

describe('<OrderDetailsCardReview />', () => {
    it('should prompt the user to rate the order if isCompletedOrder is true and hasReviewDetails is false', () => {
        render(<OrderDetailsCardReview />);

        expect(screen.getByRole('button', { name: 'Rate this transaction' })).toBeInTheDocument();
        expect(screen.getByText('You have until 21 Mar 2024, 01:10 GMT to rate this transaction.')).toBeInTheDocument();
    });

    it('should prompt the user that they cannot rate the order if is_reviewable is false', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: { ...mockUseOrderDetails().orderDetails, is_reviewable: false },
        });

        render(<OrderDetailsCardReview />);

        const notRatedButton = screen.getByRole('button', { name: 'Not rated' });

        expect(notRatedButton).toBeInTheDocument();
        expect(notRatedButton).toBeDisabled();
        expect(screen.getByText('You can no longer rate this transaction.')).toBeInTheDocument();
    });

    it('should show review details if hasReviewDetails is true with recommended text of recommended is true', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                hasReviewDetails: true,
                review_details: {
                    rating: 5,
                    recommended: true,
                },
            },
        });

        render(<OrderDetailsCardReview />);

        expect(screen.getByText('Your transaction experience')).toBeInTheDocument();
        expect(screen.getByText('Recommended')).toBeInTheDocument();
    });

    it('should show review details if hasReviewDetails is true with recommended text of Not Recommended is false', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                hasReviewDetails: true,
                review_details: {
                    rating: 5,
                    recommended: false,
                },
            },
        });

        render(<OrderDetailsCardReview />);

        expect(screen.getByText('Your transaction experience')).toBeInTheDocument();
        expect(screen.getByText('Not Recommended')).toBeInTheDocument();
    });

    it('should not show recommended status if recommended is null', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                hasReviewDetails: true,
                review_details: {
                    rating: 5,
                    recommended: null,
                },
            },
        });

        render(<OrderDetailsCardReview />);

        expect(screen.queryByText('Recommended')).not.toBeInTheDocument();
        expect(screen.queryByText('Not Recommended')).not.toBeInTheDocument();
    });

    it('should return null if isCompletedOrder is false and hasReviewDetails is false', () => {
        mockUseOrderDetails.mockReturnValue({
            orderDetails: { ...mockUseOrderDetails().orderDetails, hasReviewDetails: false, isCompletedOrder: false },
        });

        const { container } = render(<OrderDetailsCardReview />);

        expect(container).toBeEmptyDOMElement();
    });
});
