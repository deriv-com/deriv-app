import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useExchangeRateSubscription } from '@deriv/api';
import MyAdsTableRow from '../MyAdsTableRow/MyAdsTableRow';
import useDevice from '../../../../../hooks/useDevice';

const mockProps = {
    account_currency: 'USD',
    active_orders: 0,
    advertiser_details: {
        completed_orders_count: 0,
        id: '34',
        is_online: true,
        last_online_time: 1688480346,
        name: 'client CR90000212',
        rating_average: null,
        rating_count: 0,
        recommended_average: null,
        recommended_count: null,
        total_completion_rate: null,
        is_blocked: false,
        is_favourite: false,
        has_not_been_recommended: false,
        is_recommended: false,
    },
    amount: 22,
    amount_display: '22.00',
    block_trade: false,
    contact_info: '',
    counterparty_type: 'sell' as const,
    country: 'id',
    created_time: new Date(1688460999),
    description: '',
    effective_rate: 22,
    effective_rate_display: '22.00',
    id: '138',
    is_active: true,
    is_visible: true,
    local_currency: 'IDR',
    max_order_amount: 22,
    max_order_amount_display: '22.00',
    max_order_amount_limit: 22,
    max_order_amount_limit_display: '22.00',
    min_order_amount: 22,
    min_order_amount_display: '22.00',
    min_order_amount_limit: 22,
    min_order_amount_limit_display: '22.00',
    payment_info: '',
    payment_method: null,
    payment_method_names: ['Bank Transfer'],
    price: 22,
    price_display: '22.00',
    rate: 22,
    rate_display: '22.00',
    rate_type: 'fixed' as const,
    remaining_amount: 22,
    remaining_amount_display: '22.00',
    type: 'buy' as const,
    onClickIcon: jest.fn(),
    isBarred: false,
    isListed: true,
};

jest.mock('@deriv/api', () => ({
    useExchangeRateSubscription: jest.fn(),
}));

jest.mock('../../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isMobile: false,
    })),
}));

const mockUseExchangeRate = useExchangeRateSubscription as jest.Mock;

describe('MyAdsTableRow', () => {
    beforeEach(() => {
        mockUseExchangeRate.mockReturnValue({
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
    });
    it('should render the component as expected', () => {
        render(<MyAdsTableRow {...mockProps} />);
        expect(screen.getByText('Buy 138')).toBeInTheDocument();
        expect(screen.getByText('22.00 - 22.00 USD')).toBeInTheDocument();
        expect(screen.getByText('22.00 IDR')).toBeInTheDocument();
        expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
    });
    it('should render the mobile view as expected', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<MyAdsTableRow {...mockProps} />);
        expect(screen.getByText('Ad ID 138')).toBeInTheDocument();
        expect(screen.getByText('Buy USD')).toBeInTheDocument();
        expect(screen.getByText('Rate (1 USD)')).toBeInTheDocument();
        expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
    });
    it('should open the popover dropdown on clicking on menu in mobile view', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<MyAdsTableRow {...mockProps} />);
        const button = screen.getByTestId('dt_p2p_v2_actions_menu');
        userEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
            expect(screen.getByText('Deactivate')).toBeInTheDocument();
            expect(screen.getByText('Delete')).toBeInTheDocument();
            expect(screen.getByText('Duplicate')).toBeInTheDocument();
        });
    });
    //TODO: add test for onclick actions once the component is updated.
});
