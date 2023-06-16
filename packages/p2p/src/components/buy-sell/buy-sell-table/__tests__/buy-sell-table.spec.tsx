import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores/index';
import BuySellTable from '../buy-sell-table';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        fetchAdvertiserAdverts: jest.fn(),
        has_more_items_to_load: false,
        is_loading: false,
        items: [
            {
                account_currency: 'USD',
                advertiser_details: {
                    id: '14',
                    is_online: false,
                    name: 'Advertiser001',
                    rating_average: null,
                    rating_count: null,
                },
                counterparty_type: 'buy',
                min_order_amount_limit_display: '1',
                max_order_amount_limit_display: '50',
                payment_method_names: ['Alipay'],
            },
            {
                account_currency: 'USD',
                advertiser_details: {
                    id: '15',
                    is_online: true,
                    name: 'Advertiser002',
                    rating_average: 5,
                    rating_count: 2,
                },
                counterparty_type: 'buy',
                min_order_amount_limit_display: '51',
                max_order_amount_limit_display: '100',
            },
        ],
        loadMoreItems: jest.fn(),
        local_currencies: [
            {
                text: 'IDR',
                is_default: true,
            },
            {
                text: 'INR',
                is_default: false,
            },
        ],
        rendered_items: [
            {
                account_currency: 'USD',
                advertiser_details: {
                    id: '14',
                    is_online: false,
                    name: 'Advertiser001',
                    rating_average: null,
                    rating_count: null,
                },
                counterparty_type: 'buy',
                min_order_amount_limit_display: '1',
                max_order_amount_limit_display: '50',
                payment_method_names: ['Alipay'],
            },
            {
                account_currency: 'USD',
                advertiser_details: {
                    id: '15',
                    is_online: true,
                    name: 'Advertiser002',
                    rating_average: 5,
                    rating_count: 2,
                },
                counterparty_type: 'buy',
                min_order_amount_limit_display: '51',
                max_order_amount_limit_display: '100',
            },
        ],
        selected_local_currency: 'JPY',
    },
    general_store: {
        handleTabClick: jest.fn(),
    },
    my_ads_store: {
        setShowAdForm: jest.fn(),
    },
    my_profile_store: {
        getPaymentMethodsList: jest.fn(),
    },
};
const mock = mockStore({
    client: {
        currency: 'USD',
    },
});

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => <div> loading...</div>),
}));

describe('BuySellTable', () => {
    it('should render the component', () => {
        render(
            <StoreProvider store={mock}>
                <BuySellTable />
            </StoreProvider>
        );

        expect(screen.getByText('Advertisers')).toBeInTheDocument();
        expect(screen.getByText('Limits')).toBeInTheDocument();
        expect(screen.getByText('Rate (1 USD)')).toBeInTheDocument();
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
    });
    it('should render the loading component if is_loading is set to true', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                is_loading: true,
            },
        });
        render(
            <StoreProvider store={mock}>
                <BuySellTable />
            </StoreProvider>
        );

        expect(screen.getByText('loading...')).toBeInTheDocument();
    });
    it('should render the error component if there is an error upon requesting for advert list', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                api_error_message: 'Error',
            },
        });
        render(
            <StoreProvider store={mock}>
                <BuySellTable />
            </StoreProvider>
        );

        expect(screen.getByText('Error')).toBeInTheDocument();
    });
    it('should render the BuySellTableNoAds component if there is no matching ads', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                items: [],
            },
        });
        render(
            <StoreProvider store={mock}>
                <BuySellTable />
            </StoreProvider>
        );

        expect(screen.getByText(/No ads for this currency at the moment/i)).toBeInTheDocument();
    });
});
