import React from 'react';
import { render, screen } from '@testing-library/react';
import BuySell from '../buy-sell';

const mock_store = {
    general_store: {
        setActiveIndex: jest.fn(),
        active_index: 1,
    },
    buy_sell_store: {
        registerIsListedReaction: jest.fn(() => jest.fn()),
        registerAdvertIntervalReaction: jest.fn(() => jest.fn()),
        selected_local_currency: 'USD',
        show_advertiser_page: false,
        should_show_verification: true,
        setLocalCurrency: jest.fn(),
    },
};

jest.mock('Components/verification/verification', () => jest.fn(() => <div>Verification Section</div>));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<BuySellPage/>', () => {
    it('should render the buy/sell page', () => {
        render(<BuySell />);
        expect(mock_store.general_store.setActiveIndex).toHaveBeenCalledWith(0);
    });
    it('should render Verification Section when user is not verified', () => {
        render(<BuySell />);

        expect(screen.getByText('Verification')).toBeInTheDocument();
        expect(screen.getByText('Verification Section')).toBeInTheDocument();
    });
});
