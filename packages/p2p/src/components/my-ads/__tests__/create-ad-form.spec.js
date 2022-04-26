import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import { isMobile } from '@deriv/shared';
import CreateAdForm from '../create-ad-form.jsx';

const mocked_general_store = {
    client: {
        currency: 'USD',
        local_currency_config: {},
    },
    setP2PConfig: jest.fn(),
};

const mocked_my_ads_store = {
    advert_details: {
        is_visible: false,
    },
    default_advert_description: '',
    restrictLength: jest.fn(),
    setApiErrorMessage: jest.fn(),
    setIsAdCreatedModalVisible: jest.fn(),
    setIsAdExceedsDailyLimitModalOpen: jest.fn(),
    setShowAdForm: jest.fn(),
};

const mocked_floating_rate_store = {
    rate_type: '',
    exchange_rate: '',
    float_rate_offset_limit: '',
    setApiErrorMessage: jest.fn(),
    setExchangeRate: jest.fn(),
};

const mocked_my_profile_store = {
    getAdvertiserPaymentMethods: jest.fn(),
    getPaymentMethodsList: jest.fn(),
    payment_methods_list: [],
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

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

const modal_root_el = document.createElement('div');

describe('<CreateAdForm />', () => {
    beforeAll(() => {
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('Component should be rendered', () => {
        render(<CreateAdForm />);

        const el_dp2p_create_ad_form_container = screen.getByTestId('dp2p-create-ad-form_container');
        expect(el_dp2p_create_ad_form_container).toBeInTheDocument();
    });

    it('inputs must be checked for changes after making changes in each input', () => {
        render(<CreateAdForm />);

        const el_dp2p_create_ad_form__inputs = screen.getAllByRole('textbox');
        el_dp2p_create_ad_form__inputs.map(input => fireEvent.change(input, { target: { value: 123 } }));
        expect(mocked_my_ads_store.restrictLength).toHaveBeenCalled();
    });

    it('setShowAdForm func should be called after clicking `Cancel` button', () => {
        render(<CreateAdForm />);

        const el_dp2p_create_ad_form_cancel_button = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(el_dp2p_create_ad_form_cancel_button);
        expect(mocked_my_ads_store.setShowAdForm).toHaveBeenCalledWith(false);
    });

    it('checkbox must be unchecked after toggle checkbox', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, is_ad_created_modal_visible: true },
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
            floating_rate_store: mocked_floating_rate_store,
        }));
        render(<CreateAdForm />);

        const el_dp2p_create_ad_form_checkbox = screen.getByRole('checkbox');

        fireEvent.click(el_dp2p_create_ad_form_checkbox);
        expect(el_dp2p_create_ad_form_checkbox).toBeChecked(false);
    });

    it('setIsAdCreatedModalVisible func should be called after clicking `Ok` button', () => {
        useStores.mockImplementation(() => ({
            my_ads_store: { ...mocked_my_ads_store, is_ad_created_modal_visible: true },
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
            floating_rate_store: mocked_floating_rate_store,
        }));
        render(<CreateAdForm />);

        const el_dp2p_create_ad_form_confirm_button = screen.getByRole('button', { name: 'Ok' });
        fireEvent.click(el_dp2p_create_ad_form_confirm_button);

        expect(mocked_my_ads_store.setIsAdCreatedModalVisible).toHaveBeenCalledWith(false);
    });

    it('should disable button when form contains invalid data', () => {
        render(<CreateAdForm />);
        expect(screen.getByTestId('rate_type')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Post ad' })).toBeDisabled();
    });

    it('should render the component in mobile view', () => {
        isMobile.mockReturnValue(true);
        render(<CreateAdForm />);

        expect(screen.getByText('Div100vhContainer')).toBeInTheDocument();
    });
});
