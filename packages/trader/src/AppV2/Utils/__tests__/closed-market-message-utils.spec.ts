import { TradingTimesResponse } from '@deriv/api-types';
import { calculateTimeLeft, getSymbol } from '../closed-market-message-utils';

describe('calculateTimeLeft', () => {
    const mockCurrentTime = 1620000000000;

    beforeAll(() => {
        jest.spyOn(Date, 'now').mockImplementation(() => mockCurrentTime);
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should return the correct time left when the remaining time is in the future', () => {
        const futureTime = mockCurrentTime + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 4 * 60 * 1000 + 5 * 1000; // 2 days, 3 hours, 4 minutes, and 5 seconds
        const result = calculateTimeLeft(futureTime);

        expect(result).toEqual({
            days: 2,
            hours: 3,
            minutes: 4,
            seconds: 5,
        });
    });
    it('should return an empty object when the remaining time has already passed', () => {
        const pastTime = mockCurrentTime - 1000;
        const result = calculateTimeLeft(pastTime);

        expect(result).toEqual({});
    });
    it('should return the correct time left when the remaining time is exactly one day in the future', () => {
        const futureTime = mockCurrentTime + 24 * 60 * 60 * 1000;
        const result = calculateTimeLeft(futureTime);

        expect(result).toEqual({
            days: 1,
            hours: 0,
            minutes: 0,
            seconds: 0,
        });
    });
    it('should return the correct time left when the remaining time is less than a day in the future', () => {
        const futureTime = mockCurrentTime + 3 * 60 * 60 * 1000 + 20 * 60 * 1000 + 10 * 1000;
        const result = calculateTimeLeft(futureTime);

        expect(result).toEqual({
            days: 0,
            hours: 3,
            minutes: 20,
            seconds: 10,
        });
    });
});

describe('getSymbol', () => {
    const trading_times = {
        markets: [
            {
                name: 'Forex',
                submarkets: [
                    {
                        name: 'Major Pairs',
                        symbols: [
                            { symbol: 'EURUSD', name: 'EUR/USD' },
                            { symbol: 'USDJPY', name: 'USD/JPY' },
                        ],
                    },
                    {
                        name: 'Minor Pairs',
                        symbols: [{ symbol: 'GBPUSD', name: 'GBP/USD' }],
                    },
                ],
            },
            {
                name: 'Commodities',
                submarkets: [
                    {
                        name: 'Metals',
                        symbols: [{ symbol: 'XAUUSD', name: 'Gold/USD' }],
                    },
                ],
            },
        ],
    } as unknown as NonNullable<DeepRequired<TradingTimesResponse['trading_times']>>;

    it('should return the correct symbol when the target symbol exists', () => {
        const target_symbol = 'GBPUSD';
        const result = getSymbol(target_symbol, trading_times);
        expect(result).toEqual({ symbol: 'GBPUSD', name: 'GBP/USD' });
    });
    it('should return undefined when the target symbol does not exist', () => {
        const target_symbol = 'NZDUSD';
        const result = getSymbol(target_symbol, trading_times);
        expect(result).toBeUndefined();
    });
    it('should return the correct symbol when multiple symbols exist in different submarkets', () => {
        const target_symbol = 'XAUUSD';
        const result = getSymbol(target_symbol, trading_times);
        expect(result).toEqual({ symbol: 'XAUUSD', name: 'Gold/USD' });
    });
    it('should return the first matching symbol when the target symbol exists in multiple submarkets', () => {
        const modified_trading_times = {
            ...trading_times,
            markets: [
                ...trading_times.markets,
                {
                    name: 'Crypto',
                    submarkets: [
                        {
                            name: 'BTC',
                            symbols: [{ symbol: 'GBPUSD', name: 'GBP/USD Duplicate' }],
                        },
                    ],
                },
            ],
        } as unknown as NonNullable<DeepRequired<TradingTimesResponse['trading_times']>>;

        const target_symbol = 'GBPUSD';
        const result = getSymbol(target_symbol, modified_trading_times);
        expect(result).toEqual({ symbol: 'GBPUSD', name: 'GBP/USD' });
    });
});
