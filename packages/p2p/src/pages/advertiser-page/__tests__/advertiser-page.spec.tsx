import React from 'react';
import { render } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import AdvertiserPage from '../advertiser-page';

const mock_modal_manager = {
    showModal: jest.fn(),
    hideModal: jest.fn(),
    useRegisterModalProps: jest.fn(),
    is_modal_open: true,
};
jest.mock('@deriv/hooks', () => {
    return {
        ...jest.requireActual('@deriv/hooks'),
        useP2PAdvertInfo: jest.fn(() => ({ data: true, isLoading: false, isSuccess: true })),
    };
});

jest.mock('Components/modal-manager/modal-manager-context');
const mocked_useModalManagerContext = useModalManagerContext as jest.MockedFunction<
    () => Partial<ReturnType<typeof useModalManagerContext>>
>;

mocked_useModalManagerContext.mockImplementation(() => mock_modal_manager);

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    advertiser_page_store: {
        advertiser_details_id: 'id1',
        advertiser_details_name: 'test name',
        counterparty_advertiser_info: {
            name: 'name',
            is_online: 1,
        },
        is_counterparty_advertiser_blocked: false,
        onAdvertiserIdUpdate: jest.fn(),
        onMount: jest.fn(),
        setCounterpartyAdvertiserInfo: jest.fn(),
        setIsDropdownMenuVisible: jest.fn(),
        onUnmount: jest.fn(),
        onCancel: jest.fn(),
        is_loading: false,
        info: {
            name: 'name',
        },
    },
    general_store: {
        advertiser_id: 'id2',
        advertiser_info: {
            name: 'my name',
            is_online: 1,
        },
        block_unblock_user_error: '',
        error_code: '',
        active_index: 0,
        setBlockUnblockUserError: jest.fn(),
        setActiveIndex: jest.fn(),
        path: {
            my_profile: 3,
        },
        is_block_unblock_user_loading: false,
        setCounterpartyAdvertiserId: jest.fn(),
    },
    buy_sell_store: {
        show_advertiser_page: true,
        hideAdvertiserPage: jest.fn(),
        setSelectedAdState: jest.fn(),
        setShowAdvertiserPage: jest.fn(),
    },
    my_profile_store: {
        setActiveTab: jest.fn(),
    },
};

jest.mock('Pages/advertiser-page/advertiser-page-adverts', () => jest.fn(() => <div>adverts</div>));
jest.mock('Pages/advertiser-page/advertiser-page-stats', () => jest.fn(() => <div>stats</div>));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => <div> loading...</div>),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({
        hash: '',
        key: '0',
        pathname: '/cashier/p2p/advertiser',
        search: '?id=39',
    })),
}));

jest.mock('Hooks', () => ({
    ...jest.requireActual('Hooks'),
    useP2PAdvertiserAdverts: jest.fn(() => ({
        isLoading: false,
    })),
}));

describe('<Advertiserpage />', () => {
    it('should render advertiser page', () => {
        render(<AdvertiserPage />);
        expect(mock_store.advertiser_page_store.onMount).toHaveBeenCalledTimes(1);
        expect(mock_store.buy_sell_store.setShowAdvertiserPage).toHaveBeenCalledWith(true);
    });
    it('should handle unmount of advertiser page', () => {
        const { unmount } = render(<AdvertiserPage />);
        unmount();
        expect(mock_store.advertiser_page_store.onUnmount).toHaveBeenCalled();
        expect(mock_store.buy_sell_store.setShowAdvertiserPage).toHaveBeenCalledWith(false);
    });

    it('should call setCounterpartyAdvertiserId when component mounted', () => {
        render(<AdvertiserPage />);
        expect(mock_store.general_store.setCounterpartyAdvertiserId).toHaveBeenCalled();
    });
});
