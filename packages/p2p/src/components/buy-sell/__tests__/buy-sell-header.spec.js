import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import BuySellHeader from '../buy-sell-header.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

const mocked_buy_sell_store = {
    sort_list: [],
    setIsFilterModalOpen: jest.fn(),
    setItems: jest.fn(),
    setSearchTerm: jest.fn(),
    setIsLoading: jest.fn(),
    loadMoreItems: jest.fn(),
};

const setTableType = jest.fn();

beforeAll(() => {
    useStores.mockImplementation(() => ({
        buy_sell_store: mocked_buy_sell_store,
    }));
});

describe('<BuySellHeader />', () => {
    it('Component should be rendered', () => {
        render(<BuySellHeader />);

        const el_dp2p_buy_sell_header_container = screen.getByTestId('dp2p-buy-sell-header_container');

        expect(el_dp2p_buy_sell_header_container).toBeInTheDocument();
    });

    it('setTableType func should be called when click on buy/sell button', () => {
        render(<BuySellHeader is_visible={false} setTableType={setTableType} table_type={''} />);

        const el_dp2p_buy_sell__buy_button = screen.getByText('Buy');
        const el_dp2p_buy_sell__sell_button = screen.getByText('Sell');

        fireEvent.click(el_dp2p_buy_sell__buy_button);
        fireEvent.click(el_dp2p_buy_sell__sell_button);

        expect(setTableType).toHaveBeenCalledTimes(2);
    });

    it('setShouldUseClientLimits func should be called when click on checkbox', () => {
        render(<BuySellHeader is_visible={false} setTableType={setTableType} table_type={''} />);

        const el_dp2p_buy_sell_header_filter_icon = screen.getByTestId('dp2p-buy-sell-header_filter-icon');

        fireEvent.click(el_dp2p_buy_sell_header_filter_icon);
        expect(mocked_buy_sell_store.setIsFilterModalOpen).toHaveBeenCalledWith(true);
    });
});
