import React from 'react';
import { screen, render } from '@testing-library/react';
import SymbolSearchResults from '../symbol-search-results';
import TraderProviders from '../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import * as useGetSymbolSearchResults from 'AppV2/Hooks/useGetSymbolSearchResults';
import { ActiveSymbols } from '@deriv/api-types';

jest.mock('AppV2/Components/MarketCategoryItem/market-category-item', () =>
    jest.fn(() => <div>MockedMarketCategoryItem</div>)
);
jest.mock('AppV2/Components/SymbolNotFound', () => jest.fn(() => <div>SymbolNotFound</div>));

describe('<SymbolSearchResults />', () => {
    const mocked_props = {
        searchValue: '',
        setSearchValue: jest.fn(),
        setIsOpen: jest.fn(),
        setSelectedSymbol: jest.fn(),
    };
    const MockedSymbolSearchResults = (mock_props: Parameters<typeof SymbolSearchResults>[0]) => {
        return (
            <TraderProviders store={mockStore({})}>
                <SymbolSearchResults {...mock_props} />
            </TraderProviders>
        );
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('displays suggestion text when searchValue is empty', () => {
        jest.spyOn(useGetSymbolSearchResults, 'useGetSymbolSearchResults').mockReturnValue([]);
        render(MockedSymbolSearchResults(mocked_props));

        expect(screen.getByText('Try searching for markets or keywords')).toBeInTheDocument();
        expect(screen.queryByText('MockedMarketCategoryItem')).not.toBeInTheDocument();
        expect(screen.queryByText(/SymbolNotFound/)).not.toBeInTheDocument();
    });
    it('renders MarketCategoryItem components when there are search results', () => {
        jest.spyOn(useGetSymbolSearchResults, 'useGetSymbolSearchResults').mockReturnValue([
            { symbol: 'EURUSD', display_name: 'EUR/USD' },
            { symbol: 'GBPUSD', display_name: 'GBP/USD' },
            { symbol: 'CADAUD', display_name: 'CAD/AUD' },
        ] as ActiveSymbols);
        mocked_props.searchValue = 'u';
        render(MockedSymbolSearchResults(mocked_props));

        expect(screen.queryByText('Try searching for markets or keywords')).not.toBeInTheDocument();
        expect(screen.getAllByText('MockedMarketCategoryItem')).toHaveLength(3);
        expect(screen.queryByText(/SymbolNotFound/)).not.toBeInTheDocument();
    });
    it('should return symbolNotFound when search results is empty', () => {
        jest.spyOn(useGetSymbolSearchResults, 'useGetSymbolSearchResults').mockReturnValue([]);
        mocked_props.searchValue = 'abcd';
        render(MockedSymbolSearchResults(mocked_props));

        expect(screen.queryByText('Try searching for markets or keywords')).not.toBeInTheDocument();
        expect(screen.queryByText('MockedMarketCategoryItem')).not.toBeInTheDocument();
        expect(screen.getByText(/SymbolNotFound/)).toBeInTheDocument();
    });
});
