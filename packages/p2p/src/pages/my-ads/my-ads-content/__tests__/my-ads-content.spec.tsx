import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores';
import MyAdsContent from '../my-ads-content';
import { adverts } from '../../__mocks__/mock-data';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    floating_rate_store: {
        setChangeAdAlert: jest.fn(),
        change_ad_alert: false,
        rate_type: 'float',
        reached_target_date: false,
        exchange_rate: 1,
    },
    my_ads_store: {
        adverts: [],
        api_error_message: '',
        is_table_loading: false,
        loadMoreAds: jest.fn(),
        onClickCreate: jest.fn(),
        setAdverts: jest.fn(),
        setApiErrorCode: jest.fn(),
        setSelectedAdId: jest.fn(),
    },
    general_store: {
        setP2PConfig: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => <div> loading...</div>),
}));

jest.mock('../../ads-table', () => jest.fn(() => <div>ads table</div>));

const mock = mockStore({
    client: {
        currency: 'USD',
    },
});

describe('<MyAdsContent/>', () => {
    it('should render the MyAdsContent component', () => {
        render(
            <StoreProvider store={mock}>
                <MyAdsContent />
            </StoreProvider>
        );

        const create_button = screen.getByRole('button', { name: 'Create new ad' });
        expect(create_button).toBeInTheDocument();
    });
    it('should handle create new ad button click', () => {
        render(
            <StoreProvider store={mock}>
                <MyAdsContent />
            </StoreProvider>
        );

        const create_button = screen.getByRole('button', { name: 'Create new ad' });
        expect(create_button).toBeInTheDocument();
        userEvent.click(create_button);
        expect(mock_store.my_ads_store.onClickCreate).toBeCalledTimes(1);
    });
    it('should render the ads table when there are ads', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_store,
            my_ads_store: {
                ...mock_store.my_ads_store,
                adverts,
            },
        });
        render(
            <StoreProvider store={mock}>
                <MyAdsContent />
            </StoreProvider>
        );

        expect(screen.getByText('ads table')).toBeInTheDocument();
    });
    it('should display loading component when in loading state', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_store,
            my_ads_store: {
                ...mock_store.my_ads_store,
                is_table_loading: true,
            },
        });
        render(
            <StoreProvider store={mock}>
                <MyAdsContent />
            </StoreProvider>
        );

        expect(screen.getByText('loading...')).toBeInTheDocument();
    });
    it('should display error message when api throws error during processing', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_store,
            my_ads_store: {
                ...mock_store.my_ads_store,
                api_error_message: 'error message!!!',
            },
        });
        render(
            <StoreProvider store={mock}>
                <MyAdsContent />
            </StoreProvider>
        );

        expect(screen.getByText('error message!!!')).toBeInTheDocument();
    });
});
