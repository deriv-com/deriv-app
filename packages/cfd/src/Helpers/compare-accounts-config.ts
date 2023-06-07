import { TTradingPlatformAvailableAccount, TIconData } from '../Components/props.types';

const getHighlightedIconLabel = (trading_platforms: TTradingPlatformAvailableAccount): TIconData[] => {
    switch (trading_platforms.market_type) {
        case 'gaming':
            return [
                { icon: 'Synthetics', text: 'Synthetics', highlighted: true },
                { icon: 'BasketIndices', text: 'Basket Indices', highlighted: true },
                { icon: 'DerivedFX', text: 'Derived FX', highlighted: true },
                { icon: 'Stocks', text: 'Stock', highlighted: false },
                { icon: 'StockIndices', text: 'Stock Indices', highlighted: false },
                { icon: 'Commodities', text: 'Commodities', highlighted: false },
                { icon: 'Forex', text: 'Forex', highlighted: false },
                { icon: 'Cryptocurrencies', text: 'Cryptocurrencies', highlighted: false },
                { icon: 'ETF', text: 'ETF', highlighted: false },
            ];
        case 'financial':
            return [
                { icon: 'Synthetics', text: 'Synthetics', highlighted: false },
                { icon: 'BasketIndices', text: 'Basket Indices', highlighted: false },
                { icon: 'DerivedFX', text: 'Derived FX', highlighted: false },
                { icon: 'Stocks', text: 'Stock', highlighted: true },
                { icon: 'StockIndices', text: 'Stock Indices', highlighted: true },
                { icon: 'Commodities', text: 'Commodities', highlighted: true },
                { icon: 'Forex', text: 'Forex', highlighted: true },
                { icon: 'Cryptocurrencies', text: 'Cryptocurrencies', highlighted: true },
                { icon: 'ETF', text: 'ETF', highlighted: true },
            ];
        case 'all':
        default:
            return [
                { icon: 'Synthetics', text: 'Synthetics', highlighted: true },
                { icon: 'BasketIndices', text: 'Basket Indices', highlighted: true },
                { icon: 'DerivedFX', text: 'Derived FX', highlighted: true },
                { icon: 'Stocks', text: 'Stock', highlighted: true },
                { icon: 'StockIndices', text: 'Stock Indices', highlighted: true },
                { icon: 'Commodities', text: 'Commodities', highlighted: true },
                { icon: 'Forex', text: 'Forex', highlighted: true },
                { icon: 'Cryptocurrencies', text: 'Cryptocurrencies', highlighted: true },
                { icon: 'ETF', text: 'ETF', highlighted: true },
            ];
    }
};

export { getHighlightedIconLabel };
