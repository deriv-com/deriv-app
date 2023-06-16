import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores/index';
import BuySellFormReceiveAmount from '../buy-sell-form-receive-amount';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        advert: {
            local_currency: 'IDR',
        },
        is_sell_advert: true,
        receive_amount: '1000.00',
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('BuySellFormReceiveAmount', () => {
    it('should render the component for sell advert', () => {
        render(<BuySellFormReceiveAmount />);

        expect(screen.getByText("You'll receive")).toBeInTheDocument();
        expect(screen.getByText('1,000.00 IDR')).toBeInTheDocument();
    });
    it('should render the component for buy advert', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                is_sell_advert: false,
            },
        });

        render(<BuySellFormReceiveAmount />);

        expect(screen.getByText("You'll send")).toBeInTheDocument();
        expect(screen.getByText('1,000.00 IDR')).toBeInTheDocument();
    });
});
