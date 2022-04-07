import React from 'react';
import { useStores } from 'Stores';
import { isMobile } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import AdvertiserPageStats from '../advertiser-page-stats.jsx';

const mock_advertiser_info = {
    buy_completion_rate: '',
    buy_orders_amount: '',
    buy_orders_count: '',
    buy_time_avg: '',
    partner_count: '',
    release_time_avg: '',
    sell_completion_rate: '',
    sell_orders_amount: '',
    sell_orders_count: '',
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: { client: { currency: 'AED' } },
        advertiser_page_store: {
            advertiser_info: { ...mock_advertiser_info },
        },
    })),
}));

describe('<AdvertiserPageStats/>', () => {
    it('should render the component with buy completion rate if the information is available', () => {
        useStores.mockReturnValue({
            general_store: { client: { currency: 'AED' } },
            advertiser_page_store: {
                advertiser_info: { ...mock_advertiser_info, buy_completion_rate: '75', buy_orders_count: '50' },
            },
        });
        render(<AdvertiserPageStats />);

        expect(screen.getByTestId('buy-completion').innerHTML).toMatch('75% (50)');
        expect(screen.getByTestId('sell-completion').innerHTML).toMatch('-');
    });

    it('should render the component with buy completion rate if the information is available', () => {
        useStores.mockReturnValue({
            general_store: { client: { currency: 'AED' } },
            advertiser_page_store: {
                advertiser_info: { ...mock_advertiser_info, sell_completion_rate: '80', sell_orders_count: '70' },
            },
        });
        render(<AdvertiserPageStats />);

        expect(screen.getByTestId('sell-completion').innerHTML).toMatch('80% (70)');
        expect(screen.getByTestId('buy-completion').innerHTML).toMatch('-');
    });

    it('should show the trade volume only when both buy and sell info is available', () => {
        useStores.mockReturnValue({
            general_store: { client: { currency: 'AED' } },
            advertiser_page_store: {
                advertiser_info: { ...mock_advertiser_info, buy_orders_amount: '100', sell_orders_amount: '100' },
            },
        });
        render(<AdvertiserPageStats />);

        expect(screen.getByText('200.00 AED')).toBeInTheDocument();
    });

    it('should display the average pay time if buy time average is available', () => {
        useStores.mockReturnValue({
            general_store: { client: { currency: 'AED' } },
            advertiser_page_store: {
                advertiser_info: { ...mock_advertiser_info, buy_time_avg: '100' },
            },
        });
        render(<AdvertiserPageStats />);

        expect(screen.getByText('2 min')).toBeInTheDocument();
    });

    it('should display the average release time if release time average is available', () => {
        useStores.mockReturnValue({
            general_store: { client: { currency: 'AED' } },
            advertiser_page_store: {
                advertiser_info: { ...mock_advertiser_info, release_time_avg: '120' },
            },
        });
        render(<AdvertiserPageStats />);

        expect(screen.getByText('2 min')).toBeInTheDocument();
    });

    it('should render the mobile view in a mobile device', () => {
        isMobile.mockReturnValue(true);

        render(<AdvertiserPageStats />);
        expect(screen.getByTestId('mobile-buy-completion')).toBeInTheDocument();
    });
});
