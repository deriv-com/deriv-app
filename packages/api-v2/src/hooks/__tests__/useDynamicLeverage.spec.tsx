import { renderHook } from '@testing-library/react-hooks';
import useQuery from '../../useQuery';
import useDynamicLeverage from '../useDynamicLeverage';

jest.mock('../../useQuery');

describe('useDynamicLeverage', () => {
    it('should return modified data and rest properties', () => {
        const mockQueryData = {
            trading_platform_leverage: {
                leverage: {
                    stock_indices: {
                        display_name: 'Stock indices',
                        instruments: ['US_30', 'US_100', 'US_500'],
                        min: 1,
                        max: 300,
                        volume: {
                            unit: 'lot',
                            data: [
                                {
                                    from: 0.1,
                                    to: 5,
                                    leverage: 300,
                                },
                                {
                                    from: 5.1,
                                    to: 50,
                                    leverage: 200,
                                },
                                {
                                    from: 50.1,
                                    to: 100,
                                    leverage: 100,
                                },
                            ],
                        },
                    },
                    forex: {
                        display_name: 'Forex majors',
                        instruments: [],
                        min: 1,
                        max: 1500,
                        volume: {
                            unit: 'lot',
                            data: [
                                {
                                    from: 0.1,
                                    to: 1,
                                    leverage: 1500,
                                },
                                {
                                    from: 1.01,
                                    to: 5,
                                    leverage: 1000,
                                },
                                {
                                    from: 5.1,
                                    to: 10,
                                    leverage: 500,
                                },
                                {
                                    from: 10.1,
                                    to: 15,
                                    leverage: 100,
                                },
                            ],
                        },
                    },
                    metals: {
                        display_name: 'Metals',
                        instruments: ['XAUUSD', 'XAGUSD'],
                        min: 1,
                        max: 1000,
                        volume: {
                            unit: 'lot',
                            data: [
                                {
                                    from: 0.01,
                                    to: 1,
                                    leverage: 1000,
                                },
                                {
                                    from: 1.01,
                                    to: 5,
                                    leverage: 500,
                                },
                                {
                                    from: 5.01,
                                    to: 10,
                                    leverage: 100,
                                },
                                {
                                    from: 10.01,
                                    to: 15,
                                    leverage: 50,
                                },
                            ],
                        },
                    },
                    cryptocurrencies: {
                        display_name: 'Cryptocurrencies',
                        instruments: ['BTCUSD', 'ETHUSD'],
                        min: 1,
                        max: 300,
                        volume: {
                            unit: 'lot',
                            data: [
                                {
                                    from: 0.01,
                                    to: 1,
                                    leverage: 300,
                                },
                                {
                                    from: 1.01,
                                    to: 3,
                                    leverage: 200,
                                },
                                {
                                    from: 3.01,
                                    to: 5,
                                    leverage: 100,
                                },
                                {
                                    from: 5.01,
                                    to: 10,
                                    leverage: 50,
                                },
                            ],
                        },
                    },
                },
            },
        };

        (useQuery as jest.Mock).mockReturnValue({
            data: mockQueryData,
            isLoading: false,
            isError: false,
        });

        const { result } = renderHook(() => useDynamicLeverage('mt5'));

        expect(result.current.data).toEqual(mockQueryData.trading_platform_leverage.leverage);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it('should handle cases where data is not available', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
        });

        const { result } = renderHook(() => useDynamicLeverage('mt5'));

        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
    });
});
