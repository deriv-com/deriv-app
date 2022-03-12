import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import MyAdsTable from '../my-ads-table.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('Components/table/table-error.jsx', () => ({
    ...jest.requireActual('Components/table/table-error.jsx'),
    TableError: ({ message }) => <div>{message}</div>,
}));

const mocked_my_ads_store = {
    adverts: [{}],
    is_enabled: false,
    has_more_items_to_load: true,
    loadMoreAds: jest.fn(),
    onClickCreate: jest.fn(),
    setActivateDeactivateErrorMessage: jest.fn(),
    setAdverts: jest.fn(),
    setIsQuickAddErrorModalOpen: jest.fn(),
    setSelectedAdId: jest.fn(),
};

const mocked_general_store = {
    client: {
        currency: 'USD',
    },
    is_barred: false,
    is_listed: true,
};
const modal_root_el = document.createElement('div');

describe('<MyAdsTable />', () => {
    beforeAll(() => {
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('Component should be rendered', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            general_store: mocked_general_store,
        }));
        render(<MyAdsTable />);

        const el_dp2p_my_ads_table_header = screen.getByTestId('dp2p-my-ads-table_header');
        expect(el_dp2p_my_ads_table_header).toBeInTheDocument();
    });

    it('Component <Loading /> should be rendered', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, is_table_loading: true },
            general_store: mocked_general_store,
        }));
        render(<MyAdsTable />);

        const el_loading_container = screen.getByText('Loading');
        expect(el_loading_container).toBeInTheDocument();
    });

    it('Component <TableError /> should be rendered with proper message if received an error', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, api_error_message: 'test' },
            general_store: mocked_general_store,
        }));
        render(<MyAdsTable />);

        const el_dp2p_table_error_message = screen.getByText('test');
        expect(el_dp2p_table_error_message).toBeInTheDocument();
    });

    it('Should render <Empty /> component if user have no ads and onClickCreate func should be called on click on `Create new ad` button ', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, adverts: false },
            general_store: mocked_general_store,
        }));
        render(<MyAdsTable />);

        const el_dp2p_table_error_message = screen.getByText('You have no ads.');
        const el_dp2p_table_create_ad_button = screen.getByRole('button', { name: 'Create new ad' });
        fireEvent.click(el_dp2p_table_create_ad_button);

        expect(el_dp2p_table_error_message).toBeInTheDocument();
        expect(mocked_my_ads_store.onClickCreate).toHaveBeenCalled();
    });

    it('Should render modal window if received an error message and setIsQuickAddErrorModalOpen func should be called on closing modal', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, is_quick_add_error_modal_open: true },
            general_store: mocked_general_store,
        }));
        render(<MyAdsTable />);

        const el_dp2p_my_ads_table_modal_confirm_button = screen.getByRole('button', { name: 'Ok' });
        fireEvent.click(el_dp2p_my_ads_table_modal_confirm_button);
        expect(mocked_my_ads_store.setIsQuickAddErrorModalOpen).toHaveBeenCalledWith(false);
    });

    it('Should render modal window if received an error message and setActivateDeactivateErrorMessage func should be called on closing modal', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, activate_deactivate_error_message: 'test' },
            general_store: mocked_general_store,
        }));
        render(<MyAdsTable />);

        const el_dp2p_my_ads_table_modal_confirm_button = screen.getByRole('button', { name: 'Ok' });
        fireEvent.click(el_dp2p_my_ads_table_modal_confirm_button);
        expect(mocked_my_ads_store.setActivateDeactivateErrorMessage).toHaveBeenCalledWith('');
    });
});
