import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useStores } from 'Stores';
import { render, screen } from '@testing-library/react';
import AdvertiserPage from '../advertiser-page.jsx';

const mockFn = jest.fn();

const mock_advertiser_info = {
    basic_verification: '',
    buy_orders_count: 0,
    created_time: '',
    first_name: '',
    full_verification: '',
    last_name: '',
    sell_orders_count: 0,
};
const mock_advertiser_store = {
    advertiser_info: { ...mock_advertiser_info },
    advertiser_details_name: 'P2P test',
    advert: {},
    adverts: [],
    counterparty_type: 'buy',
    active_index: '',
    is_loading: false,
    error_message: '',
    show_ad_popup: false,
    onMount: jest.fn(),
    setShowAdPopup: mockFn,
    onTabChange: jest.fn(),
};

const mock_buy_sell_modal = jest.fn();

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        buy_sell_store: { hideAdvertiserPage: jest.fn() },
        advertiser_page_store: { ...mock_advertiser_store },
    })),
}));

// eslint-disable-next-line react/display-name
jest.mock('Components/buy-sell/buy-sell-modal.jsx', () => props => {
    mock_buy_sell_modal(props);
    return <mock-buy-sell-modal />;
});

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => <div>Loading</div>),
}));

jest.mock('Components/advertiser-page/advertiser-page-adverts.jsx', () =>
    jest.fn(() => <div>Advertiser Page adverts</div>)
);

describe('<AdvertiserPage/>', () => {

    it('should render BuySell modal poup if show_ad_popup is true', () => {
        useStores.mockReturnValue({
            buy_sell_store: { hideAdvertiserPage: jest.fn() },
            advertiser_page_store: {
                ...mock_advertiser_store,
                show_ad_popup: true,
            },
        });
        render(
            <BrowserRouter>
                <AdvertiserPage />
            </BrowserRouter>
        );

        expect(mock_buy_sell_modal).toHaveBeenLastCalledWith({
            selected_ad: {},
            should_show_popup: true,
            setShouldShowPopup: mockFn,
            table_type: 'buy',
        });
    });

    it('should render loading component when is_loading is set to true', () => {
        useStores.mockReturnValue({
            buy_sell_store: { hideAdvertiserPage: jest.fn() },
            advertiser_page_store: {
                ...mock_advertiser_store,
                is_loading: true,
            },
        });
        render(
            <BrowserRouter>
                <AdvertiserPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render error message when error_message is not null', () => {
        useStores.mockReturnValue({
            buy_sell_store: { hideAdvertiserPage: jest.fn() },
            advertiser_page_store: {
                ...mock_advertiser_store,
                error_message: 'P2P Test error',
            },
        });
        render(
            <BrowserRouter>
                <AdvertiserPage />
            </BrowserRouter>
        );

        expect(screen.getByText('P2P Test error')).toBeInTheDocument();
    });
});
