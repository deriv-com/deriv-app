import sortSymbols from '../sort-symbols-utils';
import { ActiveSymbols } from '@deriv/api-types';

describe('sortSymbols', () => {
    it('should sort symbols correctly according to market order', () => {
        const symbolsList = [
            { symbol: 'BTCUSD', display_name: 'BTC/USD', market: 'cryptocurrency', submarket_display_name: 'Bitcoin' },
            { symbol: 'EURUSD', display_name: 'EUR/USD', market: 'forex', submarket_display_name: 'Euro/USD' },
            {
                symbol: 'OTC_N225',
                display_name: 'Japan 225',
                market: 'indices',
                submarket_display_name: 'Asian indices',
            },
            { symbol: 'GOLD', display_name: 'GOLD', market: 'commodities', submarket_display_name: 'Gold' },
            {
                symbol: '1HZ100V',
                display_name: 'Volatility',
                market: 'synthetic_index',
                submarket_display_name: 'Derived',
            },
        ];
        const sortedSymbols = sortSymbols(symbolsList as ActiveSymbols);
        expect(sortedSymbols).toEqual([
            {
                symbol: '1HZ100V',
                display_name: 'Volatility',
                market: 'synthetic_index',
                submarket_display_name: 'Derived',
            },
            { symbol: 'EURUSD', display_name: 'EUR/USD', market: 'forex', submarket_display_name: 'Euro/USD' },
            {
                symbol: 'OTC_N225',
                display_name: 'Japan 225',
                market: 'indices',
                submarket_display_name: 'Asian indices',
            },
            { symbol: 'BTCUSD', display_name: 'BTC/USD', market: 'cryptocurrency', submarket_display_name: 'Bitcoin' },
            { symbol: 'GOLD', display_name: 'GOLD', market: 'commodities', submarket_display_name: 'Gold' },
        ]);
    });
    it('should handle symbols with same market correctly', () => {
        const symbolsList = [
            { symbol: 'GBPUSD', display_name: 'GBP/USD', market: 'forex', submarket_display_name: 'Pound/USD' },
            { symbol: 'EURUSD', display_name: 'EUR/USD', market: 'forex', submarket_display_name: 'Euro/USD' },
            { symbol: 'ETHUSD', display_name: 'ETH/USD', market: 'cryptocurrency', submarket_display_name: 'Ethereum' },
            { symbol: 'BTCUSD', display_name: 'BTC/USD', market: 'cryptocurrency', submarket_display_name: 'Bitcoin' },
        ];

        const sortedSymbols = sortSymbols(symbolsList as ActiveSymbols);
        expect(sortedSymbols).toEqual([
            { symbol: 'EURUSD', display_name: 'EUR/USD', market: 'forex', submarket_display_name: 'Euro/USD' },
            { symbol: 'GBPUSD', display_name: 'GBP/USD', market: 'forex', submarket_display_name: 'Pound/USD' },
            { symbol: 'BTCUSD', display_name: 'BTC/USD', market: 'cryptocurrency', submarket_display_name: 'Bitcoin' },
            { symbol: 'ETHUSD', display_name: 'ETH/USD', market: 'cryptocurrency', submarket_display_name: 'Ethereum' },
        ]);
    });
});
