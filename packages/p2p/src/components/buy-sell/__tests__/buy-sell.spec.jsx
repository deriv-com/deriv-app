import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores/index';
import BuySell from '../buy-sell';

const mock_store = {
    general_store: {
        should_show_popup: false,
        setActiveIndex: jest.fn(),
        active_index: 1,
    },
    buy_sell_store: {
        registerIsListedReaction: jest.fn(),
        registerAdvertIntervalReaction: jest.fn(),
        selected_local_currency: 'USD',
        show_advertiser_page: false,
        should_show_verification: true,
        setLocalCurrency: jest.fn(),
    },
};

jest.mock('Components/verification/verification.jsx', () => jest.fn(() => <div>Verification Section</div>));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
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
    it('should not render the page return section when nickname form is open ', () => {
        useStores.mockReturnValue({
            ...mock_store,
            general_store: {
                ...mock_store.general_store,
                should_show_popup: true,
            },
        });
        render(<BuySell />);

        expect(screen.queryByText('Verification')).not.toBeInTheDocument();
    });
});
