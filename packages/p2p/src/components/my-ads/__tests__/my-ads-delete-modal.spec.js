import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
// import { useIsMounted } from '@deriv/shared';
import MyAdsDeleteModal from '../my-ads-delete-modal.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

// jest.mock('@deriv/shared', () => ({
//     ...jest.requireActual('@deriv/shared'),
//     useIsMounted: jest.fn(),
// }));

const mocked_my_ads_store = {
    setDeleteErrorMessage: jest.fn(),
    setSelectedAdId: jest.fn(),
    setIsDeleteModalOpen: jest.fn(),
};

const modal_root_el = document.createElement('div');

describe('<CreateAdErrorModal />', () => {
    beforeAll(() => {
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('Component should be rendered', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, is_delete_modal_open: true },
        }));
        render(<MyAdsDeleteModal />);

        const el_dp2p_my_ads_delete_modal_container = screen.getByText('Do you want to delete this ad?');
        expect(el_dp2p_my_ads_delete_modal_container).toBeInTheDocument();
    });

    it('Component should be rendered', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, is_delete_modal_open: true },
        }));
        render(<MyAdsDeleteModal />);

        const el_dp2p_my_ads_delete_modal_cancel_button = screen.getByText('Cancel');
        fireEvent.click(el_dp2p_my_ads_delete_modal_cancel_button);

        expect(mocked_my_ads_store.setDeleteErrorMessage).toBeCalledWith('');
        expect(mocked_my_ads_store.setSelectedAdId).toBeCalledWith('');
        expect(mocked_my_ads_store.setIsDeleteModalOpen).toBeCalledWith(false);
    });

    it('Component should be rendered', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, is_delete_modal_open: true },
        }));
        // useIsMounted.mockImplementation(() => ({
        //     isMounted: () => true,
        // }));
        render(<MyAdsDeleteModal />);

        const el_dp2p_my_ads_delete_modal_delete_button = screen.getByText('Delete');
        fireEvent.click(el_dp2p_my_ads_delete_modal_delete_button);

        expect(mocked_my_ads_store.setIsDeleteModalOpen).toBeCalledWith(false);
    });
});
