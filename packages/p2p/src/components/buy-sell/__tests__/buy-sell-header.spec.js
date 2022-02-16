import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import BuySellHeader from '../buy-sell-header.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

const mockProps = () => ({
    is_visible: false,
    setTableType: jest.fn(),
    table_type: '',
});
const loadMoreItems = jest.fn();
const setIsLoading = jest.fn();
const setItems = jest.fn();
const setSearchTerm = jest.fn();
const setShouldUseClientLimits = jest.fn();

const mockUseStores = () => {
    useStores.mockImplementation(() => ({
        buy_sell_store: {
            setItems,
            setSearchTerm,
            setShouldUseClientLimits,
            setIsLoading,
            loadMoreItems,
        },
    }));
};

describe('<BuySellHeader />', () => {
    it('Component should be rendered', () => {
        mockUseStores();
        render(<BuySellHeader />);

        expect(screen.getByTestId('headerContainer')).toBeInTheDocument();
    });

    it('setTableType func should be called when click on buy/sell button', () => {
        mockUseStores();
        const props = mockProps();
        render(<BuySellHeader {...props} />);

        const buyBtn = screen.getByText('Buy');
        const sellBtn = screen.getByText('Sell');
        fireEvent.click(buyBtn);
        fireEvent.click(sellBtn);

        expect(props.setTableType).toHaveBeenCalledTimes(2);
    });

    it('setShouldUseClientLimits func should be called when click on checkbox', () => {
        mockUseStores();
        const props = mockProps();
        render(<BuySellHeader {...props} />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(setShouldUseClientLimits).toHaveBeenCalledTimes(1);
    });
});
