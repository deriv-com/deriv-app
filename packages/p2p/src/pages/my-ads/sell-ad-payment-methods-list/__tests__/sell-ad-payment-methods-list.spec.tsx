import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores';
import SellAdPaymentMethodsList from '../sell-ad-payment-methods-list';
import { advertiser_payment_methods_list } from '../../__mocks__/mock-data';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_profile_store: {
        advertiser_payment_methods_list,
    },
    general_store: {
        active_index: 0,
    },
    my_ads_store: {
        payment_method_ids: [],
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Checkbox: () => <div>Checkbox</div>,
}));

const mock_props = {
    selected_methods: ['bank_transfer'],
    onClickPaymentMethodCard: jest.fn(),
};

describe('<SellAdPaymentMethodsList/>', () => {
    it('should render the SellAdPaymentMethodsList component', () => {
        render(<SellAdPaymentMethodsList {...mock_props} />);
        const payment_method_card = screen.getAllByTestId('dt_payment_method_card_container')[0];
        expect(payment_method_card).toBeInTheDocument();
    });
    it('should handle clicking on payment method card', () => {
        render(<SellAdPaymentMethodsList {...mock_props} />);

        const payment_method_card = screen.getAllByTestId('dt_payment_method_card_container')[0];
        expect(payment_method_card).toBeInTheDocument();

        userEvent.click(payment_method_card);
        expect(mock_props.onClickPaymentMethodCard).toBeCalledTimes(1);
    });
});
