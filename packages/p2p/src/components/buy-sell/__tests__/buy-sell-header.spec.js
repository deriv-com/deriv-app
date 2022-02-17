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

beforeAll(() => mockUseStores());

describe('<BuySellHeader />', () => {
    it('Component should be rendered', () => {
        render(<BuySellHeader />);

        const el_header_container = screen.getByTestId('header_container');
        expect(el_header_container).toBeInTheDocument();
    });

    it('setTableType func should be called when click on buy/sell button', () => {
        const props = mockProps();
        render(<BuySellHeader {...props} />);

        const el_buyBtn = screen.getByText('Buy');
        const el_sellBtn = screen.getByText('Sell');
        fireEvent.click(el_buyBtn);
        fireEvent.click(el_sellBtn);

        expect(props.setTableType).toHaveBeenCalledTimes(2);
    });

    it('setShouldUseClientLimits func should be called when click on checkbox', () => {
        const props = mockProps();
        render(<BuySellHeader {...props} />);

        const el_checkbox = screen.getByRole('checkbox');
        fireEvent.click(el_checkbox);

        expect(setShouldUseClientLimits).toHaveBeenCalledTimes(1);
    });
});
