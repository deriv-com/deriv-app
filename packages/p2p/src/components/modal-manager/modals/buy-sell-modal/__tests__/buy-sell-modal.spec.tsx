import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import BuySellModal from '../buy-sell-modal';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
    showModal: jest.fn(),
};

const el_modal = document.createElement('div');

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        search: '',
    }),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('Pages/buy-sell/buy-sell-form-receive-amount.jsx', () => jest.fn(() => <div>BuySellFormReceiveAmount</div>));
jest.mock('../buy-sell-modal-error', () => jest.fn(() => <div>BuySellModalError</div>));

describe('<BuySellModal />', () => {
    beforeEach(() => {
        mock_store = {
            advertiser_page_store: {
                setFormErrorMessage: jest.fn(),
            },
            buy_sell_store: {
                advert: {
                    advertiser_details: {
                        name: 'test',
                    },
                    description: 'test description',
                    effective_rate: 1,
                    local_currency: 'IDR',
                    max_order_amount_limit_display: '10.00',
                    min_order_amount_limit: 5,
                    min_order_amount_limit_display: '5.00',
                    payment_method_names: ['Alipay'],
                    price: 1,
                    rate: 1,
                    rate_type: 'fixed',
                },
                form_props: {
                    setIsSubmitDisabled: jest.fn(),
                    setSubmitForm: jest.fn(),
                },
                selected_ad_state: {
                    account_currency: 'USD',
                },
                table_type: 'buy',
                fetchAdvertiserAdverts: jest.fn(),
                is_buy_advert: true,
                setFormProps: jest.fn(),
                setHasPaymentMethods: jest.fn(),
                setInitialReceiveAmount: jest.fn(),
                setReceiveAmount: jest.fn(),
            },
            floating_rate_store: {
                setIsMarketRateChanged: jest.fn(),
            },
            general_store: {
                balance: 10000,
                is_form_modified: false,
                setHistory: jest.fn(),
                setLocation: jest.fn(),
            },
            my_profile_store: {
                should_show_add_payment_method_form: false,
                hideAddPaymentMethodForm: jest.fn(),
                getPaymentMethodsList: jest.fn(),
                getSelectedPaymentMethodDetails: jest.fn(),
                setAddPaymentMethodErrorMessage: jest.fn(),
                setSelectedPaymentMethod: jest.fn(),
                setSelectedPaymentMethodDisplayName: jest.fn(),
                setShouldShowAddPaymentMethodForm: jest.fn(),
            },
        };
    });

    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the BuySellModal', () => {
        render(<BuySellModal />);

        expect(screen.getByText('Buy USD')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('should call setIsMarketRateChanged, hideModal, fetchAdvertiserAdverts when clicking cross icon if should_show_add_payment_method_form is false', () => {
        render(<BuySellModal />);

        const cross_icon = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(cross_icon);

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
        expect(mock_store.buy_sell_store.fetchAdvertiserAdverts).toHaveBeenCalled();
        expect(mock_store.floating_rate_store.setIsMarketRateChanged).toHaveBeenCalledWith(false);
    });

    it('should call hideAddPaymentMethodForm when clicking cross icon if should_show_add_payment_method_form is true and is_form_modified is false', () => {
        mock_store.my_profile_store.should_show_add_payment_method_form = true;

        render(<BuySellModal />);

        const cross_icon = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(cross_icon);

        expect(mock_store.my_profile_store.hideAddPaymentMethodForm).toHaveBeenCalled();
    });

    it('should call showModal when clicking cross icon if should_show_add_payment_method_form and is_form_modified is true', () => {
        mock_store.my_profile_store.should_show_add_payment_method_form = true;
        mock_store.general_store.is_form_modified = true;

        render(<BuySellModal />);

        const cross_icon = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(cross_icon);

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'CancelAddPaymentMethodModal', props: {} });
    });

    it('should setErrorMessage to empty string if is_modal_open is false', () => {
        const mockSetErrorMessage = jest.spyOn(React, 'useState');
        (mockSetErrorMessage as jest.Mock).mockImplementation(initial_value => [initial_value, jest.fn()]);

        mock_modal_manager.is_modal_open = false;

        render(<BuySellModal />);

        expect(mockSetErrorMessage).toHaveBeenCalledWith('');
    });
});
