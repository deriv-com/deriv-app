import React from 'react';
import { screen, render, act } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import BlockUserTable from '../block-user-table';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const mock_trade_partners_list = [
    { id: '1', is_blocked: 0, name: 'test1' },
    { id: '2', is_blocked: 1, name: 'test2' },
];

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
);

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('../block-user-row', () => jest.fn((list: { name: string }) => <div>{list.name}</div>));

describe('<BlockUserTable />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                is_barred: false,
                setBlockUnblockUserError: jest.fn(),
            },
            my_profile_store: {
                getTradePartnersList: jest.fn(),
                has_more_items_to_load: false,
                is_block_user_table_loading: false,
                is_trade_partners_list_empty: true,
                rendered_trade_partners_list: [],
                setIsTradePartnersListEmpty: jest.fn(),
                setSearchResults: jest.fn(),
                setSearchTerm: jest.fn(),
                setTradePartnersList: jest.fn(),
                trade_partners_list: [],
            },
        };
    });

    it('should show default message when user has no trade partners', () => {
        render(<BlockUserTable />, { wrapper });

        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });

    it('should show loading screen if is_block_user_table_loading is true', () => {
        mock_store.my_profile_store.is_block_user_table_loading = true;

        render(<BlockUserTable />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should show default message if searched advertiser does not exist', () => {
        mock_store.my_profile_store.search_term = 'sdasdsadas';
        mock_store.my_profile_store.is_trade_partners_list_empty = false;

        render(<BlockUserTable />, { wrapper });

        expect(screen.getByText('There are no matching name.')).toBeInTheDocument();
    });

    it('should show trade_partners_list if it is not empty', () => {
        act(() => {
            mock_store.my_profile_store.trade_partners_list = mock_trade_partners_list;
            mock_store.my_profile_store.rendered_trade_partners_list = mock_trade_partners_list;
        });

        render(<BlockUserTable />, { wrapper });

        expect(screen.getByTestId('dt_data_list')).toBeInTheDocument();
    });
});
