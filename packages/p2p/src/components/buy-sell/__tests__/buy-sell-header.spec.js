import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import BuySellHeader from '../buy-sell-header.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

const props = {
    is_visible: false,
    setTableType: jest.fn(),
    table_type: '',
};
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

        const el_dp2p_buy_sell__header_container = screen.getByTestId('dp2p-buy-sell__header_container');

        expect(el_dp2p_buy_sell__header_container).toBeInTheDocument();
    });

    it('setTableType func should be called when click on buy/sell button', () => {
        render(<BuySellHeader {...props} />);

        const el_dp2p_buy_sell__buy_button = screen.getByText('Buy');
        const el_dp2p_buy_sell__sell_button = screen.getByText('Sell');

        fireEvent.click(el_dp2p_buy_sell__buy_button);
        fireEvent.click(el_dp2p_buy_sell__sell_button);

        expect(props.setTableType).toHaveBeenCalledTimes(2);
    });

    it('setShouldUseClientLimits func should be called when click on checkbox', () => {
        render(<BuySellHeader {...props} />);

        const el_dp2p_buy_sell__checkbox = screen.getByRole('checkbox');

        fireEvent.click(el_dp2p_buy_sell__checkbox);

        expect(setShouldUseClientLimits).toHaveBeenCalledTimes(1);
    });
});
