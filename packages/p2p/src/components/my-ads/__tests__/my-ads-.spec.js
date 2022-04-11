import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import MyAds from '../my-ads.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('Components/table/table-error.jsx', () => ({
    ...jest.requireActual('Components/table/table-error.jsx'),
    TableError: ({ message }) => <div>{message}</div>,
}));

const mocked_my_ads_store = {
    adverts: [{}],
    is_enabled: false,
    is_loading: false,
    getAccountStatus: jest.fn(),
    has_more_items_to_load: true,
    loadMoreAds: jest.fn(),
    setAdverts: jest.fn(),
    setIsLoading: jest.fn(),
    setSelectedAdId: jest.fn(),
    setShowAdForm: jest.fn(),
    setShowEditAdForm: jest.fn(),
};

const mocked_general_store = {
    client: {
        currency: 'USD',
    },
    is_advertiser: true,
    is_barred: false,
    is_listed: true,
    poiStatusText: jest.fn(),
};

describe('<MyAds />', () => {
    it('Component <MyAdsTable /> should be rendered', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            general_store: mocked_general_store,
        }));
        render(<MyAds />);

        const el_dp2p_my_ads_table_container = screen.getByTestId('dp2p-my-ads-table_container');
        expect(el_dp2p_my_ads_table_container).toBeInTheDocument();
    });

    it('Component <MyAdsState /> should be rendered with proper message if dp2p cashier is unavailable in country', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            general_store: { ...mocked_general_store, is_advertiser: false, is_restricted: true },
        }));
        render(<MyAds />);

        const el_dp2p_my_ads_state_container = screen.getByText('Deriv P2P cashier is unavailable in your country.');
        expect(el_dp2p_my_ads_state_container).toBeInTheDocument();
    });

    it('Component <Loading /> should be rendered if is_loading prop is true', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, is_loading: true },
            general_store: mocked_general_store,
        }));
        render(<MyAds />);

        const el_loading_message = screen.getByText('Loading');
        expect(el_loading_message).toBeInTheDocument();
    });

    it('Component <MyAdsState /> should be rendered with proper message if received an error', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, error_message: 'test' },
            general_store: mocked_general_store,
        }));
        render(<MyAds />);

        const el_dp2p_my_ads_state_error_message = screen.getByText('test');
        expect(el_dp2p_my_ads_state_error_message).toBeInTheDocument();
    });

    it('Component <Verification /> should be rendered if user is not an advertiser', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            general_store: { ...mocked_general_store, is_advertiser: false },
        }));
        render(<MyAds />);

        const el_dp2p_verification_container = screen.getByTestId('dp2p-verification_container');
        expect(el_dp2p_verification_container).toBeInTheDocument();
    });
});
