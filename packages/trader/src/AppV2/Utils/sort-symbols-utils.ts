import { ActiveSymbols } from '@deriv/api-types';

type MarketOrderMap = {
    [key: string]: number;
};

const sortSymbols = (symbolsList: ActiveSymbols) => {
    const marketSortingOrder = ['synthetic_index', 'forex', 'indices', 'cryptocurrency', 'commodities'];
    const marketOrderMap: MarketOrderMap = marketSortingOrder.reduce(
        (acc: MarketOrderMap, market: string, index: number) => {
            acc[market] = index;
            return acc;
        },
        {}
    );

    return symbolsList.slice().sort((a, b) => {
        const marketOrderA = marketOrderMap[a.market] !== undefined ? marketOrderMap[a.market] : symbolsList.length;
        const marketOrderB = marketOrderMap[b.market] !== undefined ? marketOrderMap[b.market] : symbolsList.length;
        if (marketOrderA !== marketOrderB) {
            return marketOrderA - marketOrderB;
        }
        return a.submarket_display_name.localeCompare(b.submarket_display_name);
    });
};

export default sortSymbols;
