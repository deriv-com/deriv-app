import { renderHook } from '@testing-library/react-hooks';
import { useGetFavoriteSymbols } from '../useGetFavoriteSymbols';
import * as sortSymbolsUtils from 'AppV2/Utils/sort-symbols-utils';
import { useModulesStore } from 'Stores/useModulesStores';

jest.mock('AppV2/Hooks/useActiveSymbols', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        activeSymbols: [
            { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
            { symbol: 'GBPUSD', display_name: 'GBP/USD', exchange_is_open: 0 },
            { symbol: 'CADAUD', display_name: 'CAD/AUD', exchange_is_open: 0 },
        ],
    })),
}));

jest.mock('Stores/useModulesStores', () => ({
    __esModule: true,
    useModulesStore: jest.fn().mockImplementation(() => ({
        markets: { favoriteSymbols: ['EURUSD', 'CADAUD'] },
    })),
}));

jest.mock('AppV2/Utils/sort-symbols-utils', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => [
        { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
        { symbol: 'CADAUD', display_name: 'CAD/AUD', exchange_is_open: 0 },
    ]),
}));

describe('useGetFavoriteSymbols', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return sorted favorite symbols', () => {
        const { result } = renderHook(() => useGetFavoriteSymbols());

        expect(result.current).toEqual([
            { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
            { symbol: 'CADAUD', display_name: 'CAD/AUD', exchange_is_open: 0 },
        ]);
    });
    it('should handle empty favoriteSymbols array', () => {
        (useModulesStore as jest.Mock).mockImplementationOnce(() => ({
            markets: { favoriteSymbols: [] },
        }));
        (sortSymbolsUtils.default as jest.Mock).mockImplementationOnce(() => []);

        const { result } = renderHook(() => useGetFavoriteSymbols());
        expect(result.current).toEqual([]);
    });
});
