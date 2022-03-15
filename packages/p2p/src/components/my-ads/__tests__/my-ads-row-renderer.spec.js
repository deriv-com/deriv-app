import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import { isMobile } from '@deriv/shared';
import MyAdsRowRenderer from '../my-ads-row-renderer.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

const mocked_my_ads_store = {
    onClickActivateDeactivate: jest.fn(),
    onClickDelete: jest.fn(),
    onClickEdit: jest.fn(),
    showQuickAddModal: jest.fn(),
};

const mocked_my_profile_store = {
    getAdvertiserPaymentMethods: jest.fn(),
};

const mocked_general_store = {
    is_barred: false,
};

const setAdvert = jest.fn();

describe('<CreateAdErrorModal />', () => {
    it('Component should be rendered', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
        }));
        render(<MyAdsRowRenderer row={{ account_currency: 'USD' }} />);

        const el_dp2p_my_ads_row_renderer_container = screen.getByTestId('dp2p-my-ads-row-renderer_container');
        expect(el_dp2p_my_ads_row_renderer_container).toBeInTheDocument();
    });

    it('setAdvert func should be called when add payment methods to list when it is empty in desktop view', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
        }));
        render(<MyAdsRowRenderer row={{ account_currency: 'USD' }} setAdvert={setAdvert} />);

        const el_dp2p_my_ads_row_renderer_add_button = screen.getByText('Add');
        fireEvent.click(el_dp2p_my_ads_row_renderer_add_button);

        expect(setAdvert).toHaveBeenCalledWith({ account_currency: 'USD' });
        expect(mocked_my_ads_store.showQuickAddModal).toHaveBeenCalledWith({ account_currency: 'USD' });
    });

    it('setAdvert func should be called when add payment methods to list when it is empty in mobile view', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
        }));
        isMobile.mockReturnValueOnce(true);
        render(<MyAdsRowRenderer row={{ account_currency: 'USD' }} setAdvert={setAdvert} />);

        const el_dp2p_my_ads_row_renderer_add_button = screen.getByText('Add');
        fireEvent.click(el_dp2p_my_ads_row_renderer_add_button);

        expect(setAdvert).toHaveBeenCalledWith({ account_currency: 'USD' });
        expect(mocked_my_ads_store.showQuickAddModal).toHaveBeenCalledWith({ account_currency: 'USD' });
    });

    it('Payment methods list should be listed when is not empty in desktop view', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
        }));
        render(
            <MyAdsRowRenderer row={{ account_currency: 'USD', payment_method_names: ['test'] }} setAdvert={setAdvert} />
        );

        const el_dp2p_my_ads_row_renderer_payment_method_name = screen.getByText('test');
        expect(el_dp2p_my_ads_row_renderer_payment_method_name).toBeInTheDocument();
    });

    it('Payment methods list should be listed when is not empty in mobile view', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
        }));
        isMobile.mockReturnValueOnce(true);
        render(
            <MyAdsRowRenderer row={{ account_currency: 'USD', payment_method_names: ['test'] }} setAdvert={setAdvert} />
        );

        const el_dp2p_my_ads_row_renderer_payment_method_name = screen.getByText('test');
        expect(el_dp2p_my_ads_row_renderer_payment_method_name).toBeInTheDocument();
    });

    it('Popovers should be showed/hidden depends on mouse events and proper functions should be called when click popovers ', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
        }));

        render(
            <MyAdsRowRenderer row={{ account_currency: 'USD', id: 'test', is_active: false }} setAdvert={setAdvert} />
        );

        const el_dp2p_my_ads_row_renderer_container = screen.getByTestId('dp2p-my-ads-row-renderer_container');
        fireEvent.mouseEnter(el_dp2p_my_ads_row_renderer_container);

        const el_dp2p_my_ads_row_renderer_popovers_container = screen.getByTestId(
            'p2p-my-ads-row-renderer_popovers-container'
        );
        expect(el_dp2p_my_ads_row_renderer_popovers_container).toBeInTheDocument();

        const el_dp2p_my_ads_row_renderer_add_button = screen.getByText('Add');
        const el_dp2p_my_ads_row_renderer_activate_deactivate_popover = screen.getByTestId(
            'p2p-my-ads-row-renderer_de/activate-popover'
        );
        const el_dp2p_my_ads_row_renderer_edit_popover = screen.getByTestId('dp2p-my-ads-row-renderer_edit-popover');
        const el_dp2p_my_ads_row_renderer_delete_popover = screen.getByTestId(
            'dp2p-my-ads-row-renderer_delete-popover'
        );

        fireEvent.click(el_dp2p_my_ads_row_renderer_add_button);
        fireEvent.click(el_dp2p_my_ads_row_renderer_activate_deactivate_popover);
        fireEvent.click(el_dp2p_my_ads_row_renderer_edit_popover);
        fireEvent.click(el_dp2p_my_ads_row_renderer_delete_popover);

        expect(setAdvert).toHaveBeenCalledWith({ account_currency: 'USD', id: 'test', is_active: false });
        expect(mocked_my_ads_store.onClickActivateDeactivate).toHaveBeenCalled();
        expect(mocked_my_ads_store.onClickEdit).toHaveBeenCalledWith('test');
        expect(mocked_my_ads_store.onClickDelete).toHaveBeenCalledWith('test');

        fireEvent.mouseLeave(el_dp2p_my_ads_row_renderer_container);
        expect(screen.queryByTestId('p2p-my-ads-row-renderer_popovers-container')).not.toBeInTheDocument();
    });
});
