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

        expect(screen.getByTestId('receive/send label')).toBeInTheDocument();
        expect(screen.getByTestId('receive/send amount')).toBeInTheDocument();
        expect(screen.getByText("You'll send")).toBeInTheDocument();
        expect(screen.getByText('0.00 USD')).toBeInTheDocument();
    });

    test('Component should render proper message if is_sell_advert prop is true', () => {
        useStores.mockImplementation(() => ({
            buy_sell_store: { ...mocked_store_values, is_sell_advert: true },
        }));

        render(<BuySellFormReceiveAmount />);

        expect(screen.getByText("You'll receive")).toBeInTheDocument();
    });
});
