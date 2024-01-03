import React from 'react';
import { screen, render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useStores } from 'Stores/index';
import MyProfileName from '../my-profile-name';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: jest.fn(() => ({
        showModal: jest.fn(),
    })),
}));

describe('<MyProfileName />', () => {
    const currentDate = Math.floor(Date.now() / 1000);
    const nextYearsDate = Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000);

    beforeEach(() => {
        mock_store = {
            general_store: {
                is_advertiser: true,
                advertiser_info: {
                    basic_verification: 1,
                    buy_orders_count: 0,
                    created_time: currentDate,
                    full_verification: 1,
                    rating_average: null,
                    rating_count: 0,
                    recommended_average: null,
                    recommended_count: 0,
                    sell_orders_count: 0,
                },
            },
            my_profile_store: {
                full_name: 'test',
            },
        };
    });

    it('should render default view for new P2P user', () => {
        render(<MyProfileName />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Joined today'));
        expect(screen.getByText('Not rated yet'));
    });

    it('should render 1 rating when rating_count is 1', () => {
        mock_store.general_store.advertiser_info.rating_average = 5;
        mock_store.general_store.advertiser_info.rating_count = 1;

        render(<MyProfileName />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('(1 rating)'));
    });

    it('should not render default view for long time P2P user', () => {
        mock_store.general_store.advertiser_info.buy_orders_count = 200;
        mock_store.general_store.advertiser_info.created_time = nextYearsDate;
        mock_store.general_store.advertiser_info.rating_average = 4.5;
        mock_store.general_store.advertiser_info.rating_count = 50;
        mock_store.general_store.advertiser_info.recommended_average = 100;
        mock_store.general_store.advertiser_info.recommended_count = 50;
        mock_store.general_store.advertiser_info.sell_orders_count = 200;

        render(<MyProfileName />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.queryByText('Joined today')).not.toBeInTheDocument();
        expect(screen.getByText('(50 ratings)')).toBeInTheDocument();
        expect(screen.getByText('250+ trades')).toBeInTheDocument();
        expect(screen.getAllByText('verified')).toHaveLength(2);
        expect(screen.getByText('test')).toBeInTheDocument();
    });
});
