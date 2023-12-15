import React from 'react';
import { screen, render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores/index';
import BlockUserList from '../block-user-list';

const mock_trade_partners_list = [
    { id: '0', is_blocked: 0, name: 'testA' },
    { id: '1', is_blocked: 1, name: 'testB' },
];

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
);

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        error_code: '',
        block_unblock_user_error: '',
    },
    my_profile_store: {
        block_user_sort_list: [
            {
                text: localize('All'),
                value: 'all_users',
            },
            {
                text: localize('Blocked'),
                value: 'blocked_users',
            },
        ],
        getSearchedTradePartners: jest.fn(),
        getTradePartnersList: jest.fn(),
        has_more_items_to_load: false,
        is_loading: false,
        rendered_trade_partners_list: mock_trade_partners_list,
        setIsBlockUserTableLoading: jest.fn(),
        setSearchResults: jest.fn(),
        setSearchTerm: jest.fn(),
        setTradePartnersList: jest.fn(),
        should_show_block_user_list_header: false,
        trade_partners_list: mock_trade_partners_list,
    },
};

jest.mock('lodash.debounce', () => jest.fn(fn => fn));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        showModal: jest.fn(),
    })),
}));

describe('<BlockUserList />', () => {
    it('should render the BlockUserList component', () => {
        render(<BlockUserList />, { wrapper });

        expect(screen.getByPlaceholderText('Search by nickname')).toBeInTheDocument();
    });

    it('should render the loading screen if is_loading is true', () => {
        mock_store.my_profile_store.is_loading = true;

        render(<BlockUserList />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should show error message if error_code has TemporaryBar and block_unblock_user_error has an error message', () => {
        mock_store.my_profile_store.is_loading = false;
        mock_store.general_store.error_code = 'TemporaryBar';
        mock_store.general_store.block_unblock_user_error = 'Test Error TempBar';

        render(<BlockUserList />, { wrapper });

        expect(screen.getByText('Test Error TempBar')).toBeInTheDocument();
    });

    it('should call onSearch function when searching for advertiser', async () => {
        mock_store.general_store.error_code = '';
        mock_store.general_store.block_unblock_user_error = '';

        render(<BlockUserList />, { wrapper });

        const searchInput = screen.getByPlaceholderText('Search by nickname');

        act(() => userEvent.type(searchInput, 'testA'));

        await waitFor(() => {
            expect(mock_store.my_profile_store.setIsBlockUserTableLoading).toBeCalledWith(true);
            expect(mock_store.my_profile_store.setSearchTerm).toBeCalled();
            expect(mock_store.my_profile_store.getSearchedTradePartners).toBeCalled();
        });
    });
});
