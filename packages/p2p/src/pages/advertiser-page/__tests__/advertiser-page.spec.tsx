import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import AdvertisePage from '../advertiser-page';

const mock_modal_manager = {
    showModal: jest.fn(),
    hideModal: jest.fn(),
    useRegisterModalProps: jest.fn(),
    is_modal_open: true,
};

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
        },
        is_counterparty_advertiser_blocked: false,
        onMount: jest.fn(),
        onTabChange: jest.fn(),
        setIsDropdownMenuVisible: jest.fn(),
        onUnmount: jest.fn(),
        onCancel: jest.fn(),
        is_loading: false,
    },
    general_store: {
        advertiser_id: 'id2',
        advertiser_info: {
            name: 'my name',
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
    },
    buy_sell_store: {
        show_advertiser_page: true,
        hideAdvertiserPage: jest.fn(),
    },
    my_profile_store: {
        setActiveTab: jest.fn(),
    },
};

jest.mock('../advertiser-page-profile', () => jest.fn(() => <div>profile</div>));
jest.mock('../advertiser-page-adverts', () => jest.fn(() => <div>adverts</div>));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => <div> loading...</div>),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<AdvertisePage/>', () => {
    it('should render advertiser page in default state', () => {
        render(<AdvertisePage />);

        expect(screen.getByText("Advertiser's page")).toBeInTheDocument();
        expect(screen.getByText('adverts')).toBeInTheDocument();
    });
    it('should render advertiser page with overlay when advertiser is blocked', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                is_counterparty_advertiser_blocked: true,
            },
        });
        render(<AdvertisePage />);

        expect(screen.getByText('You have blocked test name.')).toBeInTheDocument();
    });
    it('should open BlockUserModal when unblock button is clicked', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                is_counterparty_advertiser_blocked: true,
            },
        });
        render(<AdvertisePage />);

        userEvent.click(screen.getByRole('button', { name: 'Unblock' }));

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'BlockUserModal' });
    });
    it('should close advertiser page when page back button is clicked and set counterparties as active tab when navigated from profile page to advertiser page', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            general_store: {
                ...mock_store.general_store,
                active_index: 3,
            },
        });
        render(<AdvertisePage />);

        userEvent.click(screen.getByTestId('dt_page_return_icon'));

        expect(mock_store.buy_sell_store.hideAdvertiserPage).toHaveBeenCalled();
        expect(mock_store.my_profile_store.setActiveTab).toHaveBeenCalledWith('my_counterparties');
    });
    it('should close advertiser page when page back button is clicked', () => {
        render(<AdvertisePage />);

        userEvent.click(screen.getByTestId('dt_page_return_icon'));

        expect(mock_store.buy_sell_store.hideAdvertiserPage).toHaveBeenCalled();
    });
    it('should render loading component when in loading state', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                is_loading: true,
            },
        });
        render(<AdvertisePage />);

        expect(screen.getByText('loading...')).toBeInTheDocument();
    });
    it('should return the error message when there is an error', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                error_message: 'error message',
            },
        });

        render(<AdvertisePage />);

        expect(screen.getByText('error message')).toBeInTheDocument();
    });
    it('should open error modal when there is error when blocking/unblocking', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            general_store: {
                ...mock_store.general_store,
                block_unblock_user_error: 'error message',
            },
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                show_advertiser_page: true,
            },
        });

        render(<AdvertisePage />);

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith(
            expect.objectContaining({
                key: 'ErrorModal',
                props: expect.objectContaining({
                    error_message: 'error message',
                    error_modal_button_text: 'Got it',
                    error_modal_title: 'Unable to block advertiser',
                    width: '40rem',
                }),
            })
        );
    });
    it('should set error message for blocking/unblocking when error code is "InvalidAdvertiserID" ', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                is_counterparty_advertiser_blocked: true,
            },
            general_store: {
                ...mock_store.general_store,
                block_unblock_user_error: 'error message',
                error_code: 'InvalidAdvertiserID',
            },
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                show_advertiser_page: true,
            },
        });

        render(<AdvertisePage />);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith(
            expect.objectContaining({
                key: 'ErrorModal',
                props: expect.objectContaining({
                    error_message: "Unblocking wasn't possible as test name is not using Deriv P2P anymore.",
                    error_modal_button_text: 'Got it',
                    error_modal_title: 'test name is no longer on Deriv P2P',
                    width: '40rem',
                }),
            })
        );
    });
    it('should handle the onClose function in errorModal', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                is_counterparty_advertiser_blocked: true,
            },
            general_store: {
                ...mock_store.general_store,
                block_unblock_user_error: 'error message',
                error_code: 'InvalidAdvertiserID',
            },
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                show_advertiser_page: true,
            },
        });

        render(<AdvertisePage />);
        mock_modal_manager.showModal.mock.calls[0][0].props.onClose();
        expect(mock_store.buy_sell_store.hideAdvertiserPage).toHaveBeenCalled();
        expect(mock_store.advertiser_page_store.onCancel).toHaveBeenCalled();
        expect(mock_store.general_store.setBlockUnblockUserError).toHaveBeenCalledWith('');
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });
    it('should handle the onClose function in errorModal and set mycounterparties as active tab if user has navigated from profile page to advertiser page', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                is_counterparty_advertiser_blocked: true,
            },
            general_store: {
                ...mock_store.general_store,
                block_unblock_user_error: 'error message',
                error_code: 'InvalidAdvertiserID',
                active_index: 3,
            },
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                show_advertiser_page: true,
            },
        });

        render(<AdvertisePage />);
        mock_modal_manager.showModal.mock.calls[0][0].props.onClose();
        expect(mock_store.buy_sell_store.hideAdvertiserPage).toHaveBeenCalled();
        expect(mock_store.my_profile_store.setActiveTab).toHaveBeenCalledWith('my_counterparties');
        expect(mock_store.advertiser_page_store.onCancel).toHaveBeenCalled();
        expect(mock_store.general_store.setBlockUnblockUserError).toHaveBeenCalledWith('');
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });
});
