import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import BuySellFormReceiveAmount from 'Pages/buy-sell/buy-sell-form-receive-amount.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        buy_sell_store: {
            advert: {
                local_currency: 'USD',
            },
            is_sell_advert: true,
            receive_amount: 100,
        },
    })),
}));

jest.mock('@sendbird/chat', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/groupChannel', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

jest.mock('@sendbird/chat/message', () => ({
    SendbirdChat: jest.fn().mockReturnValue({}),
}));

describe('<BuySellFormReceiveAmount/>', () => {
    it('should show the proper description', () => {
        const { rerender } = render(<BuySellFormReceiveAmount />);

        expect(screen.getByText("You'll receive")).toBeInTheDocument();

        useStores.mockReturnValue({
            buy_sell_store: {
                advert: {
                    local_currency: 'USD',
                },
                is_sell_advert: false,
                receive_amount: 100,
            },
        });

        rerender(<BuySellFormReceiveAmount />);
        expect(screen.getByText("You'll send")).toBeInTheDocument();
    });

    it('should show the proper formatted amount and currency', () => {
        const { rerender } = render(<BuySellFormReceiveAmount />);

        expect(screen.getByText('100.00 USD')).toBeInTheDocument();

        useStores.mockReturnValue({
            buy_sell_store: {
                advert: {
                    local_currency: 'USD',
                },
                is_sell_advert: true,
                receive_amount: 200.552,
            },
        });

        rerender(<BuySellFormReceiveAmount />);
        expect(screen.getByText('200.55 USD')).toBeInTheDocument();
    });
});
