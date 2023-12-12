import React from 'react';
import { render } from '@testing-library/react';
import { useStores } from 'Stores/index';
import PaymentMethods from '../payment-methods';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Pages/my-profile/payment-methods/add-payment-method', () => jest.fn(() => <div>AddPaymentMethod</div>));
jest.mock('Pages/my-profile/payment-methods/payment-methods-list/edit-payment-method-form', () =>
    jest.fn(() => <div>EditPaymentMethodForm</div>)
);
jest.mock('Pages/my-profile/payment-methods/payment-methods-empty', () =>
    jest.fn(() => <div>PaymentMethodsEmpty</div>)
);
jest.mock('Pages/my-profile/payment-methods/payment-methods-list', () => jest.fn(() => <div>PaymentMethodsList</div>));

describe('<PaymentMethods />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                active_index: 3,
                setFormikRef: jest.fn(),
            },
            my_profile_store: {
                advertiser_has_payment_methods: true,
                hideAddPaymentMethodForm: jest.fn(),
                is_loading: false,
                getAdvertiserPaymentMethods: jest.fn(),
                getPaymentMethodsList: jest.fn(),
                setAddPaymentMethodErrorMessage: jest.fn(),
                setIsLoading: jest.fn(),
                setShouldShowAddPaymentMethodForm: jest.fn(),
                setShouldShowEditPaymentMethodForm: jest.fn(),
                should_show_add_payment_method_form: false,
            },
        };
    });

    it('should call getPaymentMethodsList when component mounted', () => {
        render(
            <APIProvider>
                <StoreProvider store={mockStore({})}>
                    <PaymentMethods />
                </StoreProvider>
            </APIProvider>
        );
        expect(mock_store.my_profile_store.getPaymentMethodsList).toHaveBeenCalled();
    });
});
