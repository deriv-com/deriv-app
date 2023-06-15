import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores/index';
import AdvertiserPageProfileRating from '../advertiser-page-profile-rating';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    advertiser_page_store: {
        advertiser_details_id: 'id1',
        advertiser_details_name: 'test name',
        counterparty_advertiser_info: {
            rating_average: null,
            rating_count: 0,
            recommended_average: null,
            recommended_count: null,
            is_online: 0,
        },
    },
    general_store: {
        advertiser_id: 'id2',
        advertiser_info: {
            rating_average: null,
            rating_count: 5,
            recommended_average: null,
            recommended_count: null,
            is_online: 0,
        },
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/recommended-by', () => jest.fn(() => <div>recommended by </div>));
jest.mock('Components/star-rating', () => jest.fn(() => <div>star rating</div>));

describe('<AdvertiserPageProfileRating/>', () => {
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
        render(<AdvertiserPageProfileRating />);
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
        render(<AdvertiserPageProfileRating />);
        expect(screen.getByText('4.5')).toBeInTheDocument();
        expect(screen.getByText('(3 ratings)')).toBeInTheDocument();
    });
});
