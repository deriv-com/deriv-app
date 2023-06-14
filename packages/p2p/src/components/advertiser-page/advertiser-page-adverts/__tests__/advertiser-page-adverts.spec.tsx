import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { useStores } from 'Stores/index';
import AdvertiserPageAdverts from '../advertiser-page-adverts';
import { adverts } from '../../__mocks__/mock-data';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    advertiser_page_store: {
        adverts: [],
        handleTabItemClick: jest.fn(),
        is_loading_adverts: false,
        loadMoreAdvertiserAdverts: jest.fn(),
        has_more_adverts_to_load: false,
        active_index: 0,
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

const mock = mockStore({
    client: {
        currency: 'USD',
    },
});

describe('<AdvertiserPageAdverts/>', () => {
    const renderwithRouter = (component: React.ReactElement) => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('should render the component with buy/sell tabs as the default state', () => {
        renderwithRouter(<AdvertiserPageAdverts />);

        expect(screen.getByText('Buy')).toBeInTheDocument();
        expect(screen.getByText('Sell')).toBeInTheDocument();
    });
    it('should change tabs on clicking between the buy/sell tabs', () => {
        renderwithRouter(<AdvertiserPageAdverts />);

        const sell_tab = screen.getByText('Sell');
        const buy_tab = screen.getByText('Buy');
        expect(buy_tab).toHaveClass('dc-tabs__active');
        expect(sell_tab).not.toHaveClass('dc-tabs__active');
        userEvent.click(sell_tab);
        expect(mock_store.advertiser_page_store.handleTabItemClick).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Buy')).not.toHaveClass('dc-tabs__active');
        expect(screen.getByText('Sell')).toHaveClass('dc-tabs__active');
    });
    it('should render <Empty /> component when there are no ads yet', () => {
        renderwithRouter(<AdvertiserPageAdverts />);

        expect(screen.getByText('There are no ads yet')).toBeInTheDocument();
    });
    it('should render <Loading /> component when ads section is in loading state', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                is_loading_adverts: true,
            },
        });
        renderwithRouter(<AdvertiserPageAdverts />);

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });
    it('should display the ads list in the table when there are ads for the advertiser', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                adverts,
            },
        });
        renderwithRouter(
            <StoreProvider store={mock}>
                <AdvertiserPageAdverts />
            </StoreProvider>
        );

        const sell_tab = screen.getByText('Sell');
        const buy_tab = screen.getByText('Buy');
        expect(buy_tab).toHaveClass('dc-tabs__active');
        expect(sell_tab).not.toHaveClass('dc-tabs__active');
        userEvent.click(sell_tab);
        expect(mock_store.advertiser_page_store.handleTabItemClick).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Buy')).not.toHaveClass('dc-tabs__active');
        expect(screen.getByText('Sell')).toHaveClass('dc-tabs__active');

        expect(screen.getByTestId('dt_data_list')).toBeInTheDocument();
    });
});
