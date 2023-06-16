import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores/index';
import BuySellHeaderCurrencySelector from '../buy-sell-header-currency-selector';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        onLocalCurrencySelect: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('BuySellHeaderCurrencySelector', () => {
    it('should render the component', () => {
        const local_currencies = [
            {
                display_name: 'IDR',
                has_adverts: true,
                is_default: true,
                text: 'IDR',
            },
            {
                display_name: 'INR',
                has_adverts: true,
                is_default: false,
                text: 'INR',
            },
        ];

        render(
            <BuySellHeaderCurrencySelector
                default_value='IDR'
                list={local_currencies}
                onSelect={mock_store.buy_sell_store.onLocalCurrencySelect}
            />
        );

        expect(screen.getByText('IDR')).toBeInTheDocument();
        expect(screen.getByText('INR')).toBeInTheDocument();
    });
});
