import React from 'react';
import { screen, render } from '@testing-library/react';
import MarketCategories from '../market-categories';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';

jest.mock('AppV2/Hooks/useActiveSymbols', () => ({
    ...jest.requireActual('AppV2/Hooks/useActiveSymbols'),
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('AppV2/Components/MarketCategoryTab/market-category-tab', () =>
    jest.fn(() => <div>MockedMarketCategoryTab</div>)
);
jest.mock('AppV2/Components/MarketCategory', () => jest.fn(() => <div>MockedMarketCategory</div>));

describe('<MarketCategories />', () => {
    const mocked_props = {
        selectedSymbol: '',
        setSelectedSymbol: jest.fn(),
        setIsOpen: jest.fn(),
        isOpen: false,
        marketCategoriesRef: {
            current: document.createElement('div'),
        },
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should render correct amount of mockedMarketCategoryTab', () => {
        (useActiveSymbols as jest.Mock).mockReturnValue({
            activeSymbols: [
                {
                    symbol: 'cryBTCUSD',
                    display_name: 'BTC/USD',
                    market: 'cryptocurrency',
                    market_display_name: 'Cryptocurrencies',
                    subgroup: 'none',
                    subgroup_display_name: 'None',
                    submarket: 'non_stable_coin',
                    submarket_display_name: 'Cryptocurrencies',
                },
            ],
        });
        render(<MarketCategories {...mocked_props} />);
        expect(screen.getAllByText('MockedMarketCategoryTab')).toHaveLength(3);
        expect(screen.getByText('MockedMarketCategory')).toBeInTheDocument();
    });
    it('should render no MarketCategoryTab when activeSymbols is empty', () => {
        (useActiveSymbols as jest.Mock).mockReturnValue({
            activeSymbols: [],
        });

        render(<MarketCategories {...mocked_props} />);
        expect(screen.queryByText('MockedMarketCategoryTab')).not.toBeInTheDocument();
        expect(screen.queryByText('MockedMarketCategory')).not.toBeInTheDocument();
    });
});
