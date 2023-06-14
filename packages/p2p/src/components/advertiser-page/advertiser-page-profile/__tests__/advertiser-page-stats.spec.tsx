import React from 'react';
import { isMobile } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores/index';
import AdvertisePageStats from '../advertiser-page-stats';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    advertiser_page_store: {
        advertiser_details_id: 'id1',
        counterparty_advertiser_info: {
            buy_completion_rate: 100,
            buy_orders_amount: '2.00',
            buy_orders_count: 2,
            buy_time_avg: 74,
            partner_count: 1,
            release_time_avg: 74,
            sell_completion_rate: 100,
            sell_orders_amount: '2.00',
            sell_orders_count: 2,
        },
    },
    general_store: {
        advertiser_id: 'id2',
        advertiser_info: {
            buy_completion_rate: null,
            buy_orders_amount: '0.00',
            buy_orders_count: 0,
            buy_time_avg: null,
            partner_count: 0,
            release_time_avg: null,
            sell_completion_rate: null,
            sell_orders_amount: '0.00',
            sell_orders_count: 0,
        },
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

const mock = mockStore({
    client: {
        currency: 'USD',
    },
});

describe('<AdvertisePageStats/>', () => {
    it('should render the stats section with counterparty info', () => {
        render(
            <StoreProvider store={mock}>
                <AdvertisePageStats />
            </StoreProvider>
        );

        expect(screen.getByText('Buy completion')).toBeInTheDocument();
        expect(screen.getByText('Sell completion')).toBeInTheDocument();
        expect(screen.getByText('Avg. pay time')).toBeInTheDocument();
        expect(screen.getByText('Avg. release time')).toBeInTheDocument();
        expect(screen.getByText('Trade volume')).toBeInTheDocument();
        expect(screen.getByText('Trade partners')).toBeInTheDocument();
    });

    it('should render the stats section with user own info', () => {
        mock_store.advertiser_page_store.advertiser_details_id = 'id2';
        render(
            <StoreProvider store={mock}>
                <AdvertisePageStats />
            </StoreProvider>
        );

        expect(screen.getByText('Buy completion')).toBeInTheDocument();
        expect(screen.getByText('Sell completion')).toBeInTheDocument();
        expect(screen.getByText('Avg. pay time')).toBeInTheDocument();
        expect(screen.getByText('Avg. release time')).toBeInTheDocument();
        expect(screen.getByText('Trade volume')).toBeInTheDocument();
        expect(screen.getByText('Trade partners')).toBeInTheDocument();
    });
    it('should render the stats section in responsive view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        render(
            <StoreProvider store={mock}>
                <AdvertisePageStats />
            </StoreProvider>
        );

        expect(screen.getByText('Buy completion')).toBeInTheDocument();
    });
});
