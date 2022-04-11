import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import BuySellModal from '../buy-sell-modal.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(() => false),
}));

const mocked_advertiser_page_store = {
    setFormErrorMessage: jest.fn(),
};

const mocked_buy_sell_store = {
    account_currency: 'USD',
    advert: {
        advertiser_details: {
            name: 'test',
        },
        description: 'test',
        local_currency: 'test',
        payment_methods_names: ['test1'],
        price: 10,
    },
    contact_info: 'test',
    form_props: {
        setIsSubmitDisabled: jest.fn(() => [false, () => {}]),
        setSubmitForm: jest.fn(),
    },
    is_sell_advert: false,
    payment_info: 'test',
    setFormProps: jest.fn(),
    setHasPaymentMethods: jest.fn(),
    setInitialReceiveAmount: jest.fn(),
};

const mocked_my_profile_store = {
    getPaymentMethodsList: jest.fn(),
    getSelectedPaymentMethodDetails: jest.fn(),
    selected_payment_method_display_name: 'test',
    setAddPaymentMethodErrorMessage: jest.fn(),
    setIsCancelAddPaymentMethodModalOpen: jest.fn(),
    setSelectedPaymentMethod: jest.fn(),
    setSelectedPaymentMethodDisplayName: jest.fn(),
    setShouldShowAddPaymentMethodForm: jest.fn(),
    should_show_add_payment_method_form: true,
};

const mocked_general_store = {
    nickname: 'test',
    props: {
        modal_root_id: '123',
    },
    redirectTo: jest.fn(),
};

const mocked_order_store = {
    setOrderId: jest.fn(),
};

useStores.mockImplementation(() => ({
    advertiser_page_store: mocked_advertiser_page_store,
    buy_sell_store: mocked_buy_sell_store,
    my_profile_store: mocked_my_profile_store,
    general_store: mocked_general_store,
    order_store: mocked_order_store,
}));

const setShouldShowPopup = jest.fn();

const props = {
    selected_ad: {
        account_currency: 'USD',
    },
    setShouldShowPopup,
    should_show_popup: true,
};

describe('<BuySellModal />', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('Proper component should be rendered on desktop view', () => {
        useStores.mockImplementation(() => ({
            advertiser_page_store: mocked_advertiser_page_store,
            buy_sell_store: mocked_buy_sell_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
            order_store: mocked_order_store,
        }));
        render(<BuySellModal {...props} />);

        expect(screen.getByTestId('dp2p-buy-sell-modal_container')).toBeInTheDocument();
    });

    it('Proper component should be rendered on mobile view', () => {
        useStores.mockImplementation(() => ({
            advertiser_page_store: mocked_advertiser_page_store,
            buy_sell_store: mocked_buy_sell_store,
            my_profile_store: mocked_my_profile_store,
            general_store: mocked_general_store,
            order_store: mocked_order_store,
        }));
        isMobile.mockReturnValue(true);
        render(<BuySellModal {...props} />);

        expect(screen.getByTestId('dp2p-mobile-full-page-modal_container')).toBeInTheDocument();
    });

    it('Order confirmation must be cancelled when click on Cancel button', () => {
        useStores.mockImplementation(() => ({
            advertiser_page_store: mocked_advertiser_page_store,
            buy_sell_store: mocked_buy_sell_store,
            my_profile_store: { ...mocked_my_profile_store, should_show_add_payment_method_form: false },
            general_store: mocked_general_store,
            order_store: mocked_order_store,
        }));
        render(<BuySellModal {...props} />);

        fireEvent.click(screen.getByText('Cancel'));
        expect(setShouldShowPopup).toHaveBeenCalledWith(false);
        expect(mocked_my_profile_store.setShouldShowAddPaymentMethodForm).toHaveBeenCalledWith(false);
    });
});
