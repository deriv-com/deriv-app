import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores/index';
import PaymentMethods from '../payment-methods';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/add-payment-method', () => jest.fn(() => <div>AddPaymentMethod</div>));
jest.mock('../edit-payment-method-form', () => jest.fn(() => <div>EditPaymentMethodForm</div>));
jest.mock('../payment-methods-empty', () => jest.fn(() => <div>PaymentMethodsEmpty</div>));
jest.mock('../payment-methods-list', () => jest.fn(() => <div>PaymentMethodsList</div>));

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
                setAddPaymentMethodErrorMessage: jest.fn(),
                setIsLoading: jest.fn(),
                setShouldShowAddPaymentMethodForm: jest.fn(),
                setShouldShowEditPaymentMethodForm: jest.fn(),
                should_show_add_payment_method_form: false,
            },
        };
    });

    it('should render PaymentMethodsList by default', () => {
        render(<PaymentMethods />);

        expect(screen.getByText('PaymentMethodsList')).toBeInTheDocument();
    });

    it('should render Loading Component if is_loading is true', () => {
        mock_store.my_profile_store.is_loading = true;

        render(<PaymentMethods />);

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should render AddPaymentMethod if should_show_add_payment_method_form is true', () => {
        mock_store.my_profile_store.should_show_add_payment_method_form = true;

        render(<PaymentMethods />);

        expect(screen.getByText('AddPaymentMethod')).toBeInTheDocument();
    });

    it('should render EditPaymentMethodForm if should_show_edit_payment_method_form is true', () => {
        mock_store.my_profile_store.should_show_edit_payment_method_form = true;

        render(<PaymentMethods />);

        expect(screen.getByText('EditPaymentMethodForm')).toBeInTheDocument();
    });

    it('should render PaymentMethodsEmpty if advertiser_has_payment_methods is false', () => {
        mock_store.my_profile_store.advertiser_has_payment_methods = false;

        render(<PaymentMethods />);

        expect(screen.getByText('PaymentMethodsEmpty')).toBeInTheDocument();
    });
});
