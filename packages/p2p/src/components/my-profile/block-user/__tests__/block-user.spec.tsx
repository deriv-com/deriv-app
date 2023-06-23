import React from 'react';
import { act, screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { localize } from 'Components/i18next';
import BlockUser from '../block-user';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const mock_trade_partners_list = [
    { id: '0', is_blocked: 0, name: 'testA' },
    { id: '1', is_blocked: 1, name: 'testB' },
];

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        show_advertiser_page: false,
    },
    general_store: {
        active_index: 3,
        block_unblock_user_error: '',
        error_code: '',
        setBlockUnblockUserError: jest.fn(),
    },
    my_profile_store: {
        active_tab: my_profile_tabs.MY_COUNTERPARTIES,
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
        onSubmit: jest.fn(),
        rendered_trade_partners_list: mock_trade_partners_list,
        selected_trade_partner: {
            is_blocked: 0,
            name: 'test',
        },
        setActiveTab: jest.fn(),
        setIsBlockUserTableLoading: jest.fn(),
        setSearchResults: jest.fn(),
        setSearchTerm: jest.fn(),
        setTradePartnersList: jest.fn(),
        should_show_block_user_list_header: false,
        trade_partners_list: mock_trade_partners_list,
    },
};

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    showModal: jest.fn(),
    useRegisterModalProps: jest.fn(),
};

const el_modal = document.createElement('div');

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DesktopWrapper: jest.fn(({ children }) => children),
    MobileWrapper: jest.fn(({ children }) => children),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('../block-user-list', () => jest.fn(() => <div>BlockUserList</div>));

describe('<BlockUser />', () => {
    it('should render the BlockUser component', () => {
        render(<BlockUser />);

        expect(screen.getAllByText('BlockUserList').length).toBe(2);
    });

    it('should call setActiveTab when clicking on pageReturn', () => {
        render(<BlockUser />);

        const pageReturnIcon = screen.getByTestId('dt_mobile_full_page_return_icon');
        userEvent.click(pageReturnIcon);

        expect(mock_store.my_profile_store.setActiveTab).toBeCalledWith(my_profile_tabs.MY_STATS);
    });

    it('should display ErrorModal with error_message, not block_unblock_user_error, when error_code is InvalidAdvertiserID while Blocking', () => {
        act(() => {
            mock_store.general_store.block_unblock_user_error = 'error';
            mock_store.general_store.error_code = 'InvalidAdvertiserID';
        });

        render(<BlockUser />);

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({
            key: 'ErrorModal',
            props: {
                error_message: "Blocking wasn't possible as test is not using Deriv P2P anymore.",
                error_modal_button_text: 'Got it',
                error_modal_title: 'test is no longer on Deriv P2P',
                has_close_icon: false,
                onClose: expect.any(Function),
                width: '40rem',
            },
        });
    });

    it('should display ErrorModal with error_message, not block_unblock_user_error, when error_code is InvalidAdvertiserID while Unblocking', () => {
        act(() => {
            mock_store.my_profile_store.selected_trade_partner.is_blocked = 1;
            mock_store.general_store.block_unblock_user_error = 'error';
            mock_store.general_store.error_code = 'InvalidAdvertiserID';
        });

        render(<BlockUser />);

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({
            key: 'ErrorModal',
            props: {
                error_message: "Unblocking wasn't possible as test is not using Deriv P2P anymore.",
                error_modal_button_text: 'Got it',
                error_modal_title: 'test is no longer on Deriv P2P',
                has_close_icon: false,
                onClose: expect.any(Function),
                width: '40rem',
            },
        });
    });

    it('should display ErrorModal with block_unblock_user_error, not error_message, when error_code is not InvalidAdvertiserID', () => {
        act(() => {
            mock_store.general_store.block_unblock_user_error = 'error';
            mock_store.general_store.error_code = 'AdvertiserNotFound';
        });

        render(<BlockUser />);

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({
            key: 'ErrorModal',
            props: {
                error_message: 'error',
                error_modal_button_text: 'Got it',
                error_modal_title: 'Unable to block advertiser',
                has_close_icon: false,
                onClose: expect.any(Function),
                width: '40rem',
            },
        });
    });
});
