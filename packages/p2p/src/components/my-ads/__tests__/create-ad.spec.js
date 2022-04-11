import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import CreateAd from '../create-ad.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

const mocked_general_store = {
    client: {
        currency: 'USD',
        local_currency_config: {},
    },
};

const mocked_my_ads_store = {
    default_advert_description: '',
    getAdvertiserInfo: jest.fn(),
    is_form_loading: false,
    setApiErrorMessage: jest.fn(),
    setShouldShowAddPaymentMethodModal: jest.fn(),
    setShowAdForm: jest.fn(),
};

const mocked_my_profile_store = {
    getAdvertiserPaymentMethods: jest.fn(),
    getPaymentMethodsList: jest.fn(),
    payment_methods_list: [],
    should_show_add_payment_method_error_modal: false,
};

describe('<CreateAd />', () => {
    it('Should render <CreateAdForm /> component, should unmount it if return button is clicked', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
        }));
        render(<CreateAd />);

        const el_dp2p_page_return_create_ad_button = screen.getByText('Create new ad');
        const el_dp2p_page_return_return_icon = screen.getByTestId('dp2p-page-return_icon-button');
        fireEvent.click(el_dp2p_page_return_return_icon);

        expect(el_dp2p_page_return_create_ad_button).toBeInTheDocument();
        expect(mocked_my_ads_store.setShowAdForm).toHaveBeenCalledWith(false);
    });

    it('Should render <Loading /> component if is_form_loading prop us true', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, is_form_loading: true },
        }));
        render(<CreateAd />);

        const el_loading_container = screen.getByText('Loading');
        expect(el_loading_container).toBeInTheDocument();
    });
});
