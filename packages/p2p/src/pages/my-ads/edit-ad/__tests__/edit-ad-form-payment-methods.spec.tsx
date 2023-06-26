import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import EditAdFormPaymentMethods from '../edit-ad-form-payment-methods';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        payment_method_ids: [],
        payment_method_names: [],
        setPaymentMethodIds: jest.fn(),
        setPaymentMethodNames: jest.fn(),
    },
    general_store: {
        active_index: 1,
    },
    my_profile_store: {
        advertiser_has_payment_methods: false,
        advertiser_payment_methods_list: [
            {
                ID: '123',
                name: 'test',
                is_enabled: 1,
                method: 'test',
                display_name: 'test_payment_method',
                fields: {
                    account: {
                        display_name: 'test',
                        required: 1,
                        type: 'test',
                        value: 'test',
                    },
                    instructions: {
                        display_name: 'test',
                        required: 1,
                        type: 'test',
                        value: 'test',
                    },
                },
            },
        ],
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('../../buy-ad-payment-methods-list', () => {
    const BuyAdPaymentMethodsList = () => <div>BuyAdPaymentMethodsList</div>;
    return BuyAdPaymentMethodsList;
});

const mock_props = {
    is_sell_advert: false,
    setSelectedMethods: jest.fn(),
    touched: jest.fn(),
    selected_methods: [],
};

describe('<EditAdFormPaymentMethods/>', () => {
    it('should render the default state with BuyAdPaymentMethodsList for buy ad', () => {
        render(<EditAdFormPaymentMethods {...mock_props} />);

        expect(screen.getByText('BuyAdPaymentMethodsList')).toBeInTheDocument();
    });
    it('should render the PaymehtMethodCard component for sell advert when advertiser has no payment methods', () => {
        const new_mock_props = { ...mock_props, is_sell_advert: true };
        render(<EditAdFormPaymentMethods {...new_mock_props} />);

        const add_section = screen.getByText('Payment method');
        expect(add_section).toBeInTheDocument();
        userEvent.click(add_section);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'CreateAdAddPaymentMethodModal' });
    });
    it('should render the SellAdPaymentMethodsList component for sell advert when advertiser already has payment methods', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            my_profile_store: {
                ...mocked_store_values.my_profile_store,
                advertiser_has_payment_methods: true,
            },
        });
        const new_mock_props = { ...mock_props, is_sell_advert: true };
        render(<EditAdFormPaymentMethods {...new_mock_props} />);

        expect(screen.getByText('test_payment_method')).toBeInTheDocument();
        const add_section = screen.getByText('Payment method');
        expect(add_section).toBeInTheDocument();
        userEvent.click(add_section);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'CreateAdAddPaymentMethodModal' });
    });
    it('should handle the onClickPaymentMethodCard function to add selected payment method', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            my_profile_store: {
                ...mocked_store_values.my_profile_store,
                advertiser_has_payment_methods: true,
            },
        });
        const new_mock_props = { ...mock_props, is_sell_advert: true };
        render(<EditAdFormPaymentMethods {...new_mock_props} />);

        expect(screen.getByText('test_payment_method')).toBeInTheDocument();
        const add_section = screen.getByText('test_payment_method');
        userEvent.click(add_section);
        expect(mocked_store_values.my_ads_store.payment_method_ids).toEqual(['123']);
    });
    it('should handle the onClickPaymentMethodCard function to remove selected payment method', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            my_profile_store: {
                ...mocked_store_values.my_profile_store,
                advertiser_has_payment_methods: true,
            },
            my_ads_store: {
                ...mocked_store_values.my_ads_store,
                payment_method_ids: ['123'],
            },
        });
        const new_mock_props = { ...mock_props, is_sell_advert: true };
        render(<EditAdFormPaymentMethods {...new_mock_props} />);

        expect(screen.getByText('test_payment_method')).toBeInTheDocument();
        const add_section = screen.getByText('test_payment_method');
        userEvent.click(add_section);
        expect(mocked_store_values.my_ads_store.setPaymentMethodIds).toHaveBeenCalledWith([]);
    });
    it('should clear the payment_method_ids and payment_method_names values on component unmount', () => {
        const { unmount } = render(<EditAdFormPaymentMethods {...mock_props} />);
        unmount();
        expect(mocked_store_values.my_ads_store.setPaymentMethodIds).toHaveBeenCalledWith([]);
        expect(mocked_store_values.my_ads_store.setPaymentMethodNames).toHaveBeenCalledWith([]);
    });
});
