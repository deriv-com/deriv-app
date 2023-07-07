import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import BuyAdPaymentMethodsList, { TBuyAdPaymentMethodsListProps } from '../buy-ad-payment-methods-list';
import { available_payment_methods } from '../../__mocks__/mock-data';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        current_method: {
            is_deleted: false,
            key: null,
        },
        payment_method_names: [],
        setCurrentMethod: jest.fn(),
        show_ad_form: true,
    },
    my_profile_store: {
        getPaymentMethodDisplayName: jest.fn(
            (value: keyof typeof available_payment_methods) => available_payment_methods[value].display_name
        ),
        payment_methods_list: [
            {
                value: 'bank_transfer',
                text: 'Bank transfer',
            },
            {
                value: 'alipay',
                text: 'Ali pay',
            },
            {
                value: 'skrill',
                text: 'Skrill',
            },
        ],
        available_payment_methods,
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

const mock_props: TBuyAdPaymentMethodsListProps = {
    selected_methods: [],
    setSelectedMethods: jest.fn(),
    touched: jest.fn(),
    should_show_hint: true,
};

describe('<BuyAdPaymentMethodsList/>', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'deriv_app');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the BuyAdPaymentMethodsList component', () => {
        render(<BuyAdPaymentMethodsList {...mock_props} />);

        const field = screen.getByPlaceholderText('Add');
        expect(field).toBeInTheDocument();
    });
    it('should handle dropdown item click', async () => {
        render(<BuyAdPaymentMethodsList {...mock_props} />);

        const field = screen.getByPlaceholderText('Add');
        field.click();
        const item = screen.getByText('Bank transfer');
        await waitFor(() => expect(item).toBeInTheDocument());
        await waitFor(() => userEvent.click(item));
        await waitFor(() => expect(mock_props.setSelectedMethods).toBeCalled());
    });
    it('should handle dropdown item click when selected method is deleted', async () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            my_ads_store: {
                ...mock_store.my_ads_store,
                current_method: {
                    is_deleted: true,
                    key: 1,
                },
            },
        });
        render(<BuyAdPaymentMethodsList {...mock_props} />);

        const field = screen.getByPlaceholderText('Add');
        await waitFor(() => field.click());
        const item = screen.getByText('Ali pay');
        await waitFor(() => expect(item).toBeInTheDocument());
        await waitFor(() => userEvent.click(item));
        expect(mock_store.my_ads_store.payment_method_names[1]).toEqual('alipay');
    });
    it('should render list if payment methods are already selected', async () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            my_ads_store: {
                ...mock_store.my_ads_store,
                current_method: {
                    is_deleted: false,
                    key: null,
                },
            },
        });
        mock_props.selected_methods = ['bank_transfer', 'alipay'];
        render(<BuyAdPaymentMethodsList {...mock_props} />);
        const field = screen.getByDisplayValue('Bank Transfer');
        expect(field).toBeInTheDocument();
        await waitFor(() => field.focus());
        const item = screen.getByDisplayValue('Alipay');
        await waitFor(() => expect(item).toBeInTheDocument());
        await waitFor(() => userEvent.click(item));
        expect(mock_store.my_ads_store.setCurrentMethod).toBeCalled();
    });
    it('should handle list if current method is deleted', async () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            my_ads_store: {
                ...mock_store.my_ads_store,
                current_method: {
                    is_deleted: true,
                    key: 0,
                },
            },
        });
        mock_props.selected_methods = ['bank_transfer', 'alipay'];
        render(<BuyAdPaymentMethodsList {...mock_props} />);
        const field = screen.getByDisplayValue('Bank Transfer');
        expect(field).toBeInTheDocument();
        await waitFor(() => field.focus());
        const icon = screen.getAllByTestId('dt_buy-ad-payment-methods-list__icon')[0];
        act(() => {
            userEvent.click(icon);
        });
        const input_field = screen.getAllByTestId('dt_buy-ad-payment-methods-list__input')[0];
        await waitFor(() => expect(input_field).toBeInTheDocument());
        await waitFor(() => userEvent.click(input_field));
        await waitFor(() => expect(input_field).toHaveValue(''));
    });
    it('should handle onclick for hint', async () => {
        render(<BuyAdPaymentMethodsList {...mock_props} />);
        const hint = screen.getByText('Add new.');
        expect(hint).toBeInTheDocument();
        act(() => {
            userEvent.click(hint);
        });
        await waitFor(() => expect(mock_props.touched).toBeCalled());
    });
    it('should handle onclick for icon click if ad form is to be shown', async () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            my_ads_store: {
                ...mock_store.my_ads_store,
                current_method: {
                    is_deleted: false,
                    key: null,
                },
            },
        });
        mock_props.selected_methods = ['bank_transfer', 'alipay'];
        render(<BuyAdPaymentMethodsList {...mock_props} />);
        const icon = screen.getAllByTestId('dt_buy-ad-payment-methods-list__icon')[1];
        act(() => {
            userEvent.click(icon);
        });
        expect(mock_props.setSelectedMethods).toBeCalled();
    });
    it('should handle onclick for icon click if ad form is not to be shown', async () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            my_ads_store: {
                ...mock_store.my_ads_store,
                show_ad_form: false,
            },
        });
        mock_props.selected_methods = ['bank_transfer', 'alipay'];
        render(<BuyAdPaymentMethodsList {...mock_props} />);
        const icon = screen.getAllByTestId('dt_buy-ad-payment-methods-list__icon')[1];
        act(() => {
            userEvent.click(icon);
        });
        expect(mock_props.setSelectedMethods).toBeCalled();
    });
});
