import React from 'react';
import { useExtendedOrderDetails } from '@/hooks';
import { p2p } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetails from '../OrderDetails';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        goBack: mockHistoryPush,
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        order: {
            useGet: jest.fn().mockReturnValue({
                data: {},
                isLoading: true,
            }),
        },
    },
    useActiveAccount: jest.fn(() => ({
        data: {
            currency: 'USD',
        },
    })),
    useServerTime: jest.fn(() => ({
        data: {
            server_time: 1626864000,
        },
    })),
}));

jest.mock('@/hooks', () => ({
    useExtendedOrderDetails: jest.fn().mockReturnValue({
        data: {
            isBuyOrderForUser: true,
            shouldShowLostFundsBanner: true,
        },
    }),
}));

jest.mock('../../../components/OrderDetailsCard', () => ({
    OrderDetailsCard: () => <div>OrderDetailsCard</div>,
}));
jest.mock('../../../components/OrderDetailsCard/OrderDetailsCardFooter', () => ({
    OrderDetailsCardFooter: () => <div>OrderDetailsCardFooter</div>,
}));
jest.mock('../../OrdersChatSection', () => ({
    OrdersChatSection: () => <div>OrdersChatSection</div>,
}));

const mockUseDevice = useDevice as jest.Mock;
const mockUseGet = p2p.order.useGet as jest.Mock;
const mockUseExtendedOrderDetails = useExtendedOrderDetails as jest.Mock;

describe('<OrderDetails />', () => {
    it('should show loading screen if isLoading is true', () => {
        render(<OrderDetails orderId='1' />);

        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should render Desktop view if isMobile is false', () => {
        mockUseGet.mockReturnValue({
            data: {},
            isLoading: false,
        });

        render(<OrderDetails orderId='1' />);

        expect(screen.getByText('Buy USD order')).toBeInTheDocument();
        expect(
            screen.getByText('Don’t risk your funds with cash transactions. Use bank transfers or e-wallets instead.')
        ).toBeInTheDocument();
        expect(screen.getByText('OrderDetailsCard')).toBeInTheDocument();
        expect(screen.getByText('OrdersChatSection')).toBeInTheDocument();
    });

    it('should call goBack when back button is clicked', () => {
        render(<OrderDetails orderId='1' />);

        const backButton = screen.getByTestId('dt_p2p_v2_page_return_btn');
        userEvent.click(backButton);

        expect(mockHistoryPush).toHaveBeenCalled();
    });

    it('should render Mobile view if isMobile is true', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });

        render(<OrderDetails orderId='1' />);

        expect(screen.getByText('Buy USD order')).toBeInTheDocument();
        expect(screen.getByText('OrderDetailsCard')).toBeInTheDocument();
        expect(screen.queryByText('OrdersChatSection')).not.toBeInTheDocument();
    });

    it('should show OrdersChatSection if Chat icon is clicked', () => {
        render(<OrderDetails orderId='1' />);

        const chatButton = screen.getByTestId('dt_p2p_v2_order_details_chat_button');
        userEvent.click(chatButton);

        expect(screen.getByText('OrdersChatSection')).toBeInTheDocument();
        expect(screen.queryByText('OrderDetailsCard')).not.toBeInTheDocument();
    });

    it('should show Sell USD order if isBuyOrderForUser is false', () => {
        mockUseExtendedOrderDetails.mockReturnValue({
            data: {
                isBuyOrderForUser: false,
                shouldShowLostFundsBanner: true,
            },
        });

        render(<OrderDetails orderId='1' />);

        expect(screen.getByText('Sell USD order')).toBeInTheDocument();
    });
});
