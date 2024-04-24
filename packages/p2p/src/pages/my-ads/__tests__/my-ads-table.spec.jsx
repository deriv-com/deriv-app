import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import MyAdsTable from '../my-ads-table';

const mock_store_values = {
    my_ads_store: {
        setAdverts: jest.fn(),
        setSelectedAdId: jest.fn(),
        loadMoreAds: jest.fn(),
        is_table_loading: false,
        api_error_message: null,
        setApiErrorCode: jest.fn(),
        adverts: [],
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store_values),
}));

jest.mock('../../buy-sell/no-ads', () => jest.fn(() => <div>No Ads Component</div>));

const mock_use_store_values = mockStore({
    client: {
        currency: 'USD',
    },
});

describe('<MyAdsTable/>', () => {
    it('should render the NoAds component when there are no ads', () => {
        render(
            <StoreProvider store={mock_use_store_values}>
                <MyAdsTable />
            </StoreProvider>
        );
        expect(screen.getByText('No Ads Component')).toBeInTheDocument();
    });
});
