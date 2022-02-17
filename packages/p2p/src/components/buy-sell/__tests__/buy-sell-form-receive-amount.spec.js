import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import BuySellFormReceiveAmount from '../buy-sell-form-receive-amount.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

describe('<BuySellFormReceiveAmount />', () => {
    const mocked_store_values = {
        advert: {
            local_currency: 'USD',
        },
        is_sell_advert: false,
        receive_amount: 0,
    };

    test('Component should be rendered, should render proper message, amount and currency', () => {
        useStores.mockImplementation(() => ({
            buy_sell_store: mocked_store_values,
        }));

        render(<BuySellFormReceiveAmount />);

        const el_dp2p_buy_sell_form_receive_amount__label_container = screen.getByTestId(
            'dp2p-buy-sell-form-receive-amount__label_container'
        );
        const el_dp2p_buy_sell_form_receive_amount__amount_container = screen.getByTestId(
            'dp2p-buy-sell-form-receive-amount__amount_container'
        );
        const el_dp2p_buy_sell_form_receive_amount__send_notification = screen.getByText("You'll send");
        const el_dp2p_buy_sell_form_receive_amount__amount_notification = screen.getByText('0.00 USD');

        expect(el_dp2p_buy_sell_form_receive_amount__label_container).toBeInTheDocument();
        expect(el_dp2p_buy_sell_form_receive_amount__amount_container).toBeInTheDocument();
        expect(el_dp2p_buy_sell_form_receive_amount__send_notification).toBeInTheDocument();
        expect(el_dp2p_buy_sell_form_receive_amount__amount_notification).toBeInTheDocument();
    });

    test('Component should render proper message if is_sell_advert prop is true', () => {
        useStores.mockImplementation(() => ({
            buy_sell_store: { ...mocked_store_values, is_sell_advert: true },
        }));

        render(<BuySellFormReceiveAmount />);

        const el_dp2p_buy_sell_form_receive_amount__receive = screen.getByText("You'll receive");
        expect(el_dp2p_buy_sell_form_receive_amount__receive).toBeInTheDocument();
    });
});
