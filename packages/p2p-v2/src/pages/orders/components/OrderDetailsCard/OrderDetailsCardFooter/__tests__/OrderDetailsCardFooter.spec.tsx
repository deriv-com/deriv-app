import React from 'react';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetailsCardFooter from '../OrderDetailsCardFooter';

const mockUseDispute = {
    isSuccess: true,
    mutate: jest.fn(),
};

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        orderDispute: {
            useDispute: () => mockUseDispute,
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

const mockUseDevice = useDevice as jest.Mock;

jest.mock('@/hooks', () => {
    const modalManager = {
        hideModal: jest.fn(),
        isModalOpenFor: jest.fn(),
        showModal: jest.fn(),
    };
    modalManager.showModal.mockImplementation(() => {
        modalManager.isModalOpenFor.mockReturnValue(true);
    });
    return {
        ...jest.requireActual('@/hooks'),
        useModalManager: jest.fn().mockReturnValue(modalManager),
    };
});

jest.mock('@/providers/OrderDetailsProvider', () => ({
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
    it('should open the complain modal on clicking the complain button', async () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        mockUseOrderDetails.mockReturnValue({
            orderDetails: {
                ...mockUseOrderDetails().orderDetails,
                shouldShowCancelAndPaidButton: false,
                shouldShowOnlyComplainButton: true,
            },
        });
        render(<OrderDetailsCardFooter />);
        const complainButton = screen.getByRole('button', { name: 'Complain' });
        expect(complainButton).toBeInTheDocument();
        userEvent.click(complainButton);
        await waitFor(() => {
            expect(screen.getByText('I’ve not received any payment.')).toBeInTheDocument();
        });
    });
});
