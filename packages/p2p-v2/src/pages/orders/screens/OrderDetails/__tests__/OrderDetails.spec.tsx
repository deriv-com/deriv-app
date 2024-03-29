import React from 'react';
import { useExtendedOrderDetails } from '@/hooks';
import { p2p } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetails from '../OrderDetails';

const mockHistoryPush = jest.fn();
let mockSearch = '';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        goBack: mockHistoryPush,
    }),
    useLocation: () => ({
        search: mockSearch,
    }),
    useParams: () => ({
        orderId: '1',
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
                failureReason: {},
                isError: false,
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
    useSendbird: () => ({
        isOnline: true,
        lastOnlineTime: 123546789,
        nickname: 'John Doe',
    }),
}));

jest.mock('../../../components/OrderDetailsCard', () => ({
    OrderDetailsCard: () => <div>OrderDetailsCard</div>,
}));
jest.mock('../../../components/OrderDetailsCard/OrderDetailsCardFooter', () => ({
    OrderDetailsCardFooter: () => <div>OrderDetailsCardFooter</div>,
}));
jest.mock('../../../components/ChatFooter', () => ({
    ChatFooter: () => <div>ChatFooter</div>,
}));
jest.mock('../../../components/ChatMessages', () => ({
    ChatMessages: () => <div>ChatMessages</div>,
}));

const mockUseDevice = useDevice as jest.Mock;
const mockUseGet = p2p.order.useGet as jest.Mock;
const mockUseExtendedOrderDetails = useExtendedOrderDetails as jest.Mock;

describe('<OrderDetails />', () => {
    it('should show loading screen if isLoading is true', () => {
        render(<OrderDetails />);

        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should render Desktop view if isMobile is false', () => {
        mockUseGet.mockReturnValue({
            data: {},
            isLoading: false,
        });

        render(<OrderDetails />);

        expect(screen.getByText('Buy USD order')).toBeInTheDocument();
        expect(
            screen.getByText('Don’t risk your funds with cash transactions. Use bank transfers or e-wallets instead.')
        ).toBeInTheDocument();
        expect(screen.getByText('OrderDetailsCard')).toBeInTheDocument();
        expect(screen.getByText('ChatMessages')).toBeInTheDocument();
        expect(screen.getByText('ChatFooter')).toBeInTheDocument();
    });

    it('should call goBack when back button is clicked', () => {
        render(<OrderDetails />);

        const backButton = screen.getByTestId('dt_p2p_v2_page_return_btn');
        userEvent.click(backButton);

        expect(mockHistoryPush).toHaveBeenCalled();
    });

    it('should render Mobile view if isMobile is true', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });

        render(<OrderDetails />);

        expect(screen.getByText('Buy USD order')).toBeInTheDocument();
        expect(screen.getByText('OrderDetailsCard')).toBeInTheDocument();
        expect(screen.queryByText('ChatMessages')).not.toBeInTheDocument();
        expect(screen.queryByText('ChatFooter')).not.toBeInTheDocument();
    });

    it('should show OrdersChatSection if Chat icon is clicked', () => {
        render(<OrderDetails />);

        const chatButton = screen.getByTestId('dt_p2p_v2_order_details_chat_button');
        userEvent.click(chatButton);

        expect(screen.getByText('ChatMessages')).toBeInTheDocument();
        expect(screen.getByText('ChatFooter')).toBeInTheDocument();
        expect(screen.queryByText('OrderDetailsCard')).not.toBeInTheDocument();
    });

    it('should call goBack when back button is clicked in mobile view and showChat is true in search param', () => {
        mockSearch = '?showChat=true';

        render(<OrderDetails />);

        const backButton = screen.getByTestId('dt_p2p_v2_mobile_wrapper_button');
        userEvent.click(backButton);

        expect(mockHistoryPush).toHaveBeenCalled();

        mockSearch = '';
    });

    it('should show Sell USD order if isBuyOrderForUser is false', () => {
        mockUseExtendedOrderDetails.mockReturnValue({
            data: {
                isBuyOrderForUser: false,
                shouldShowLostFundsBanner: true,
            },
        });

        render(<OrderDetails />);

        expect(screen.getByText('Sell USD order')).toBeInTheDocument();
    });

    it('should show error message if isError is true', () => {
        mockUseGet.mockReturnValue({
            data: {},
            failureReason: { error: { message: 'error message' } },
            isError: true,
            isLoading: false,
        });

        render(<OrderDetails />);

        expect(screen.getByText('error message')).toBeInTheDocument();
    });
});
