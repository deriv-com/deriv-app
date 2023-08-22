import React from 'react';
import { render } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AdvertiserPage from '../advertiser-page.jsx';

jest.mock('@sendbird/chat', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/groupChannel', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/message', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

const mock_modal_manager = {
    showModal: jest.fn(),
    hideModal: jest.fn(),
    useRegisterModalProps: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context');

useModalManagerContext.mockImplementation(() => mock_modal_manager);

const mocked_store_values = {
    advertiser_page_store: {
        advertiser_details_id: 'id1',
        advertiser_details_name: 'test name',
        counterparty_advertiser_info: {
            name: 'name',
        },
        is_counterparty_advertiser_blocked: false,
        onMount: jest.fn(),
        onTabChange: jest.fn(),
        setIsDropdownMenuVisible: jest.fn(),
        onUnmount: jest.fn(),
        onCancel: jest.fn(),
        is_loading: false,
        info: {
            name: 'name',
        },
        onAdvertiserIdUpdate: jest.fn(),
    },
    general_store: {
        advertiser_id: 'id2',
        advertiser_info: {
            name: 'my name',
        },
    },
    buy_sell_store: {
        show_advertiser_page: true,
        hideAdvertiserPage: jest.fn(),
        setShowAdvertiserPage: jest.fn(),
    },
};

jest.mock('../block-user/block-user-overlay', () => jest.fn(() => <div>overlay</div>));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

describe('<AdvertiserPage />', () => {
    it('should render advertiser page', () => {
        render(<AdvertiserPage />);
        expect(mocked_store_values.advertiser_page_store.onMount).toHaveBeenCalledTimes(1);
        expect(mocked_store_values.buy_sell_store.setShowAdvertiserPage).toHaveBeenCalledWith(true);
    });
    it('should handle unmount of advertiser page', () => {
        const { unmount } = render(<AdvertiserPage />);
        unmount();
        expect(mocked_store_values.advertiser_page_store.onUnmount).toHaveBeenCalledTimes(1);
        expect(mocked_store_values.buy_sell_store.setShowAdvertiserPage).toHaveBeenCalledWith(false);
    });
});
