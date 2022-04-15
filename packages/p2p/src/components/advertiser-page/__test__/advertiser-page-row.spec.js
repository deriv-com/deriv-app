import React from 'react';
import { useStores } from 'Stores';
import { isMobile } from '@deriv/shared';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdvertiserPageRow from '../advertiser-page-row.jsx';

const mock_data = {
    local_currency: 'INR',
    max_order_amount_limit_display: 10,
    min_order_amount_limit_display: 1,
    payment_method_names: ['test-pay'],
    price_display: '',
};
const props = {
    row: { ...mock_data },
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn().mockReturnValue(false),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        advertiser_page_store: {
            counterparty_type: 'buy',
            advertiser_details_id: '123',
        },
        buy_sell_store: {
            setSelectedAdState: jest.fn(),
        },
        general_store: {
            advertiser_id: '123',
            client: { currency: 'AED' },
            is_barred: false,
        },
    }),
}));

describe('<AdvertiserPageRow/>', () => {
    it('Buy/sell button is not visible if the ad is created by the user', () => {
        render(<AdvertiserPageRow {...props} />);

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render advert data if available', () => {
        render(<AdvertiserPageRow {...props} />);

        expect(screen.getAllByRole('cell').length).toBe(4);
    });

    it('should render Buy button if the ad is not created by the user and the counter party type is buy', () => {
        useStores.mockReturnValue({
            advertiser_page_store: {
                counterparty_type: 'buy',
                advertiser_details_id: '456',
            },
            buy_sell_store: {
                setSelectedAdState: jest.fn(),
            },
            general_store: {
                advertiser_id: '123',
                client: { currency: 'AED' },
                is_barred: false,
            },
        });
        render(<AdvertiserPageRow {...props} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Buy AED')).toBeInTheDocument();
    });

    it('should render Sell button if the ad is not created by the user and the counter party type is sell', () => {
        useStores.mockReturnValue({
            advertiser_page_store: {
                counterparty_type: 'sell',
                advertiser_details_id: '456',
            },
            buy_sell_store: {
                setSelectedAdState: jest.fn(),
            },
            general_store: {
                advertiser_id: '123',
                client: { currency: 'AED' },
                is_barred: false,
            },
        });

        render(<AdvertiserPageRow row={{ ...mock_data, payment_method_names: null }} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Sell AED')).toBeInTheDocument();
    });

    it('should invoke popup function when buy/sell button is clicked', async () => {
        const mockFn = jest.fn();
        render(<AdvertiserPageRow {...props} showAdPopup={mockFn} />);
        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(mockFn).toHaveBeenCalled();
        });
    });

    it('should disable the button if the user is barred', () => {
        useStores.mockReturnValue({
            advertiser_page_store: {
                counterparty_type: 'sell',
                advertiser_details_id: '456',
            },
            buy_sell_store: {
                setSelectedAdState: jest.fn(),
            },
            general_store: {
                advertiser_id: '123',
                client: { currency: 'AED' },
                is_barred: true,
            },
        });
        render(<AdvertiserPageRow {...props} />);

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render data in tabular column in mobile view', () => {
        isMobile.mockReturnValue(true);
        render(<AdvertiserPageRow row={{ ...mock_data, payment_method_names: [] }} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render data in tabular column in mobile view', () => {
        useStores.mockReturnValue({
            advertiser_page_store: {
                counterparty_type: 'buy',
                advertiser_details_id: '456',
            },
            buy_sell_store: {
                setSelectedAdState: jest.fn(),
            },
            general_store: {
                advertiser_id: '123',
                client: { currency: 'AED' },
                is_barred: true,
            },
        });
        render(<AdvertiserPageRow row={{ ...mock_data, payment_method_names: null }} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Buy AED')).toBeInTheDocument();
    });
});
