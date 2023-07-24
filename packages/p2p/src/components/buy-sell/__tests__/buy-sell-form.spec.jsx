import React from 'react';
import { render, screen } from '@testing-library/react';
import BuySellForm from '../buy-sell-form';

let mock_store;

const mock_modal_manager = {
    isCurrentModal: false,
    showModal: jest.fn(),
    hideModal: jest.fn(),
};
const props = {
    setIsSubmitDisabled: jest.fn(),
    setErrorMessage: jest.fn(),
    setSubmitForm: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));
jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('BuySellForm', () => {
    beforeEach(() => {
        mock_store = {
            advertiser_page_store: {
                setFormErrorMessage: jest.fn(),
            },
            buy_sell_store: {
                account_currency: 'USD',
                advert: {
                    advertiser_details: {
                        name: 'Advertiser001',
                    },
                    counterparty_type: 'buy',
                    description: 'Please call 02203400',
                    effective_rate: 13500,
                    local_currency: 'IDR',
                    max_order_amount_limit: 50,
                    max_order_amount_limit_display: '50.00',
                    min_order_amount_limit: 0.1,
                    min_order_amount_limit_display: '0.10',
                    price: 13500,
                    rate: 13500,
                    rate_type: 'fixed',
                    type: 'sell',
                },
                form_props: props,
                is_buy_advert: true,
                setFormProps: jest.fn(),
                setHasPaymentMethods: jest.fn(),
                setInitialReceiveAmount: jest.fn(),
                setPaymentMethodIds: jest.fn(),
                setReceiveAmount: jest.fn(),
            },
            general_store: {
                advertiser_buy_limit: 100,
                advertiser_sell_limit: 100,
                contact_info: '',
                payment_info: '',
            },
            floating_rate_store: {
                exchange_rate: 14938,
            },
            my_profile_store: {
                advertiser_payment_methods_list: [{ display_name: 'Alipay' }],
                getPaymentMethodsList: jest.fn(),
                setSelectedPaymentMethod: jest.fn(),
                setSelectedPaymentMethodDisplayName: jest.fn(),
                setShouldShowAddPaymentMethodForm: jest.fn(),
            },
        };
    });
    it('should render the component with UPI payment method', () => {
        mock_store.buy_sell_store.advert.payment_method_names = ['Unified Payments Interface(UPI)'];
        render(<BuySellForm {...props} />);
        expect(screen.getByTestId('dt_unifiedpaymentsinterface(upi)')).toBeInTheDocument();
    });
});
