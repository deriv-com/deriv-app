import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores/index';
import BuySellForm from '../buy-sell-form';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
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
    it('should render the component with sell advert details upon clicking the buy button', () => {
        render(<BuySellForm {...props} />);

        expect(screen.getByText('Advertiser001')).toBeInTheDocument();
        expect(screen.getByText(/13,500.00/i)).toBeInTheDocument();
        expect(screen.getByText('Enter buy amount')).toBeInTheDocument();
        expect(screen.getByText('Please call 02203400')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_buy_sell_form_bank_details')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_buy_sell_form_contact_details')).not.toBeInTheDocument();
    });
    it('should render the component with buy advert details upon clicking the sell button', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                advert: {
                    advertiser_details: {
                        name: 'Advertiser002',
                    },
                    counterparty_type: 'sell',
                    description: 'Please call 02203400',
                    effective_rate: 13500,
                    local_currency: 'IDR',
                    max_order_amount_limit_display: '50.00',
                    min_order_amount_limit: 0.1,
                    min_order_amount_limit_display: '0.10',
                    price: 13500,
                    rate: 13500,
                    rate_type: 'fixed',
                    type: 'buy',
                },
                is_buy_advert: false,
                is_sell_advert: true,
            },
        });

        render(<BuySellForm {...props} />);

        expect(screen.getByText('Advertiser002')).toBeInTheDocument();
        expect(screen.getByText(/13,500.00/i)).toBeInTheDocument();
        expect(screen.getByText('Enter sell amount')).toBeInTheDocument();
        expect(screen.getByTestId('dt_buy_sell_form_bank_details')).toBeInTheDocument();
        expect(screen.getByTestId('dt_buy_sell_form_contact_details')).toBeInTheDocument();
    });
});
