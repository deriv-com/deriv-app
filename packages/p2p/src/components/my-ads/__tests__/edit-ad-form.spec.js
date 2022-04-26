import React from 'react';
import { act, fireEvent, screen, render, waitFor } from '@testing-library/react';
import { useUpdatingAvailableBalance } from 'Components/hooks';
import { useStores } from 'Stores';
import { isMobile } from '@deriv/shared';
import EditAdForm from '../edit-ad-form.jsx';

const mocked_general_store = {
    client: {
        currency: 'USD',
        local_currency_config: {},
    },
    setP2PConfig: jest.fn(),
};

const mock_advert_info = {
    account_currency: 'USD',
    amount_display: '0',
    contact_info: '',
    description: '',
    local_currency: 'AED',
    max_order_amount_display: '10',
    min_order_amount_display: '1',
    payment_method_names: ['cash', 'crypto'],
    payment_method_details: ['Cash', 'Crypto'],
    rate_display: '',
    type: 'fixed',
};

const mocked_my_ads_store = {
    p2p_advert_information: mock_advert_info,
    advert_details: {
        is_visible: false,
    },
    default_advert_description: '',
    payment_method_ids: [],
    is_edit_ad_error_modal_visible: false,
    edit_ad_form_error: '',
    setShowEditAdForm: jest.fn(),
    setEditAdFormError: jest.fn(),
    setIsEditAdErrorModalVisible: jest.fn(),
    onClickSaveEditAd: jest.fn(),
    validateEditAdForm: jest.fn(),
    restrictLength: jest.fn(),
    restrictDecimalPlace: jest.fn(),
};

const mocked_floating_rate_store = {
    is_loading: false,
    rate_type: '',
    exchange_rate: '',
    float_rate_offset_limit: '',
    setApiErrorMessage: jest.fn(),
    setExchangeRate: jest.fn(),
};

const mocked_my_profile_store = {
    payment_methods_list: [],
    payment_method_value: '',
    getPaymentMethodDisplayName: jest.fn(),
    getPaymentMethodValue: jest.fn(),
    getAdvertiserPaymentMethods: jest.fn(),
    getPaymentMethodsList: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        my_ads_store: mocked_my_ads_store,
        my_profile_store: mocked_my_profile_store,
        general_store: mocked_general_store,
        floating_rate_store: mocked_floating_rate_store,
    })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
    Div100vhContainer: ({ children }) => (
        <div>
            Div100vhContainer
            <div>{children}</div>
        </div>
    ),
}));

jest.mock('Components/hooks', () => ({
    ...jest.requireActual('Components/hooks'),
    useUpdatingAvailableBalance: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

const modal_root_el = document.createElement('div');

describe('<EditAdForm />', () => {
    beforeAll(() => {
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should display loader when loading state is set to true', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
            floating_rate_store: { ...mocked_floating_rate_store, is_loading: true },
        }));
        render(<EditAdForm />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('inputs must be checked for changes after making changes in each input', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: mocked_my_ads_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
            floating_rate_store: {...mocked_floating_rate_store},
        }));
        render(<EditAdForm />);

        const el_dp2p_create_ad_form__inputs = screen.getAllByRole('textbox');
        el_dp2p_create_ad_form__inputs.map(input => fireEvent.change(input, { target: { value: 123 } }));
        expect(mocked_my_ads_store.restrictLength).toHaveBeenCalled();
    });

    it('should hide the form after clicking `Cancel` button', () => {
        render(<EditAdForm />);

        const el_dp2p_create_ad_form_cancel_button = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(el_dp2p_create_ad_form_cancel_button);
        expect(mocked_my_ads_store.setShowEditAdForm).toHaveBeenCalledWith(false);
    });

    it('should hide modal after clicking `Ok` button', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, is_edit_ad_error_modal_visible: true },
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
            floating_rate_store: mocked_floating_rate_store,
        }));
        render(<EditAdForm />);

        const el_dp2p_create_ad_form_confirm_button = screen.getByRole('button', { name: 'Ok' });
        fireEvent.click(el_dp2p_create_ad_form_confirm_button);

        expect(mocked_my_ads_store.setIsEditAdErrorModalVisible).toHaveBeenCalledWith(false);
    });

    it('should disable button when form contains invalid data', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: {
                ...mocked_my_ads_store,
                p2p_advert_information: { ...mock_advert_info, payment_method_names: [], payment_method_details: [] },
            },
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
            floating_rate_store: { ...mocked_floating_rate_store, rate_type: 'float' },
        }));
        act(() => {
            render(<EditAdForm />);
        });

        expect(screen.getByTestId('float_rate_type')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
    });

    it('should render the component in mobile view', () => {
        isMobile.mockReturnValue(true);
        render(<EditAdForm />);

        expect(screen.getByText('Div100vhContainer')).toBeInTheDocument();
    });
});
