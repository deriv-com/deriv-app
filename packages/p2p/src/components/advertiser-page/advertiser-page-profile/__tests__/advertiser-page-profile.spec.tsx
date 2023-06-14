import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores/index';
import AdvertiserPageProfile from '../advertiser-page-profile';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    advertiser_page_store: {
        advertiser_details_id: 'id1',
        advertiser_details_name: 'test name',
        counterparty_advertiser_info: {
            basic_verification: 1,
            buy_orders_count: 0,
            created_time: 1686539211,
            first_name: '',
            full_verification: 0,
            is_online: 0,
            last_online_time: 1686656506,
            last_name: '',
            rating_average: null,
            rating_count: 0,
            recommended_average: null,
            recommended_count: null,
            sell_orders_count: 0,
        },
    },
    general_store: {
        advertiser_id: 'id2',
        advertiser_info: {
            basic_verification: 1,
            buy_orders_count: 5,
            created_time: 1686539217,
            first_name: 'test2',
            full_verification: 1,
            is_online: 1,
            last_online_time: 1686656509,
            last_name: 'user2',
            rating_average: null,
            rating_count: 5,
            recommended_average: null,
            recommended_count: null,
            sell_orders_count: 5,
        },
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('../advertiser-page-stats', () => jest.fn(() => <div>stats</div>));
jest.mock('Components/recommended-by', () => jest.fn(() => <div>recommended by </div>));
jest.mock('Components/star-rating', () => jest.fn(() => <div>star rating</div>));

describe('<AdvertiserPageProfile/>', () => {
    it('should display advertiser profile section with name and joining date for old user', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                counterparty_advertiser_info: {
                    ...mock_store.advertiser_page_store.counterparty_advertiser_info,
                    created_time: new Date().getTime() / 1000 - 86400,
                },
            },
        });
        render(<AdvertiserPageProfile />);

        expect(screen.getByText('test name')).toBeInTheDocument();
        expect(screen.getByText('Joined 1d')).toBeInTheDocument();
    });
    it('should display user real name if first name and last name is present', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                counterparty_advertiser_info: {
                    ...mock_store.advertiser_page_store.counterparty_advertiser_info,
                    first_name: 'test',
                    last_name: 'user',
                },
            },
        });
        render(<AdvertiserPageProfile />);

        expect(screen.getByText('(test user)')).toBeInTheDocument();
    });
    it('should display 1 rating count when only 1 rating present', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                counterparty_advertiser_info: {
                    ...mock_store.advertiser_page_store.counterparty_advertiser_info,
                    rating_average: 4,
                    rating_count: 1,
                },
            },
        });
        render(<AdvertiserPageProfile />);
        expect(screen.getByText('4.0')).toBeInTheDocument();
        expect(screen.getByText('(1 rating)')).toBeInTheDocument();
    });
    it('should display rating average when more than 1 rating count present', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                counterparty_advertiser_info: {
                    ...mock_store.advertiser_page_store.counterparty_advertiser_info,
                    rating_average: 4.5,
                    rating_count: 3,
                },
            },
        });
        render(<AdvertiserPageProfile />);
        expect(screen.getByText('4.5')).toBeInTheDocument();
        expect(screen.getByText('(3 ratings)')).toBeInTheDocument();
    });
    it('should show joined today for new user', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                counterparty_advertiser_info: {
                    ...mock_store.advertiser_page_store.counterparty_advertiser_info,
                    created_time: new Date().getTime() / 1000,
                },
            },
        });
        render(<AdvertiserPageProfile />);

        expect(screen.getByText('test name')).toBeInTheDocument();
        expect(screen.getByText('Joined today')).toBeInTheDocument();
    });
    it('should display user own info when user opens own advertiser profile page', () => {
        mock_store.advertiser_page_store.advertiser_details_id = 'id2';
        render(<AdvertiserPageProfile />);

        expect(screen.getByText('test name')).toBeInTheDocument();
    });
});
