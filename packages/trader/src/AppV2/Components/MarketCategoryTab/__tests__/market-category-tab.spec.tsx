import React from 'react';
import { screen, render } from '@testing-library/react';
import MarketCategoryTab from '../market-category-tab';

describe('<MarketCategoryTab />', () => {
    const mockCategoryIndices = {
        market: 'indices',
        market_display_name: 'Stock Indices',
        subgroups: {},
    };

    const mockCategoryOther = {
        market: 'forex',
        market_display_name: 'Forex',
        subgroups: {},
    };

    it('should render "Stocks & indices" for category with market "indices"', () => {
        render(<MarketCategoryTab category={mockCategoryIndices} />);
        expect(screen.getByText('Stocks & indices')).toBeInTheDocument();
    });
    it('should render the market_display_name for other categories', () => {
        render(<MarketCategoryTab category={mockCategoryOther} />);
        expect(screen.getByText('Forex')).toBeInTheDocument();
    });
});
