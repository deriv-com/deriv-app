import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import EditAdForm from '../edit-ad-form';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    floating_rate_store: {
        float_rate_offset_limit: 0.1,
        setApiErrorMessage: jest.fn(),
        rate_type: 'float',
        reached_target_date: false,
    },
    general_store: {
        advertiser_info: {
            balance_available: 100,
        },
        setP2PConfig: jest.fn(),
    },
    my_ads_store: {
        current_method: {
            is_deleted: false,
            key: null,
        },
        payment_method_names: [],
        p2p_advert_information: {
            account_currency: 'USD',
            amount_display: '100.00',
            contact_info: 'test',
            description: 'test',
            is_active: 1,
            local_currency: 'USD',
            max_order_amount_display: '100.00',
            min_order_amount_display: '100.00',
            payment_method_names: ['test'],
            payment_method_ids: ['123'],
            rate_display: '100.00',
            type: 'buy',
            rate_type: 'fixed',
        },
        selected_ad_type: '',
        setApiErrorCode: jest.fn(),
        setEditAdFormError: jest.fn(),
        setShowEditAdForm: jest.fn(),
        restrictDecimalPlace: jest.fn(),
        restrictLength: jest.fn(),
        required_ad_type: 'fixed',
    },
    my_profile_store: {
        getPaymentMethodDisplayName: jest.fn(),
        getPaymentMethodsList: jest.fn(),
        getAdvertiserPaymentMethods: jest.fn(),
        getPaymentMethodValue: jest.fn(),
        payment_method_value: [],
        payment_methods_list: [],
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
    useRegisterModalProps: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('../edit-ad-form-payment-methods', () => {
    const EditAdFormPaymentMethods = () => <div>EditAdFormPaymentMethods</div>;
    return EditAdFormPaymentMethods;
});

const mock_use_store_values = mockStore({
    client: {
        currency: 'USD',
        local_currency_config: {
            currency: 'USD',
        },
    },
});

describe('<EditAdForm/>', () => {
    it('should render the edit ad form', () => {
        render(
            <StoreProvider store={mock_use_store_values}>
                <EditAdForm />
            </StoreProvider>
        );
        expect(screen.getByText('Edit buy ad')).toBeInTheDocument();
    });
    it('should render the amount field as disabled', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            floating_rate_store: {
                ...mocked_store_values.floating_rate_store,
                rate_type: 'fixed',
            },
        });

        render(
            <StoreProvider store={mock_use_store_values}>
                <EditAdForm />
            </StoreProvider>
        );
        const total_amount_input = screen.getByTestId('dt_offer_amount');
        expect(total_amount_input).toBeDisabled();
    });
    it('should handle onchange for floating rate field to restrict decimal places', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            my_ads_store: {
                ...mocked_store_values.my_ads_store,
                required_ad_type: 'float',
            },
        });

        render(
            <StoreProvider store={mock_use_store_values}>
                <EditAdForm />
            </StoreProvider>
        );
        const total_amount_input = screen.getByTestId('dt_float_rate_type');
        userEvent.type(total_amount_input, '100');
        expect(mocked_store_values.my_ads_store.restrictDecimalPlace).toHaveBeenCalled();
    });
    it('should show balance hint for sell ads', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            my_ads_store: {
                ...mocked_store_values.my_ads_store,
                p2p_advert_information: {
                    ...mocked_store_values.my_ads_store.p2p_advert_information,
                    type: 'sell',
                },
            },
        });
        render(
            <StoreProvider store={mock_use_store_values}>
                <EditAdForm />
            </StoreProvider>
        );

        expect(screen.getByText('Your Deriv P2P balance is 100.00 USD')).toBeInTheDocument();
    });
    it('should handle onchange for editable fields', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mocked_store_values,
            my_ads_store: {
                ...mocked_store_values.my_ads_store,
                required_ad_type: 'fixed',
            },
        });
        render(
            <StoreProvider store={mock_use_store_values}>
                <EditAdForm />
            </StoreProvider>
        );
        const total_amount_input = screen.getByTestId('dt_fixed_rate_type');
        userEvent.type(total_amount_input, '100');
        expect(mocked_store_values.my_ads_store.restrictLength).toHaveBeenCalled();
    });
    it('should disable Save Changes button when current payment method has been removed', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            my_ads_store: {
                ...mocked_store_values.my_ads_store,
                current_method: {
                    is_deleted: true,
                    key: null,
                },
            },
        });
        render(
            <StoreProvider store={mock_use_store_values}>
                <EditAdForm />
            </StoreProvider>
        );

        const save_button = screen.getByRole('button', { name: 'Save changes' });
        expect(save_button).toBeDisabled();
    });
    it('should close the edit ad form on click back button', () => {
        render(
            <StoreProvider store={mock_use_store_values}>
                <EditAdForm />
            </StoreProvider>
        );

        const back_button = screen.getByTestId('dt_page_return_icon');
        userEvent.click(back_button);
        expect(mocked_store_values.my_ads_store.setShowEditAdForm).toHaveBeenCalledWith(false);
    });
    it('should open EditAdCancelModal on clicking cancel button if form was edited ', () => {
        render(
            <StoreProvider store={mock_use_store_values}>
                <EditAdForm />
            </StoreProvider>
        );

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({
            key: 'EditAdCancelModal',
            props: {},
        });
    });
});
