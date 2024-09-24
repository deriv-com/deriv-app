import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useGetSymbolSearchResults } from '../useGetSymbolSearchResults';
import * as sortSymbolsUtils from 'AppV2/Utils/sort-symbols-utils';

jest.mock('AppV2/Utils/sort-symbols-utils', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => [
        { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
        { symbol: 'GBPUSD', display_name: 'GBP/USD', exchange_is_open: 0 },
    ]),
}));

jest.mock('AppV2/Hooks/useActiveSymbols', () => ({
    ...jest.requireActual('AppV2/Hooks/useActiveSymbols'),
    __esModule: true,
    default: jest.fn(() => ({
        default_symbol: 'CADAUD',
        activeSymbols: [
            { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
            { symbol: 'GBPUSD', display_name: 'GBP/USD', exchange_is_open: 0 },
            { symbol: 'CADAUD', display_name: 'CAD/AUD', exchange_is_open: 0 },
        ],
    })),
}));

describe('useGetSymbolSearchResults', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return empty array if searchValue is empty', () => {
        (sortSymbolsUtils.default as jest.Mock).mockImplementationOnce(() => []);
        const { result } = renderHook(() => useGetSymbolSearchResults(''));
        expect(result.current).toEqual([]);
    });
    it('should return sorted symbols if searchValue is found', () => {
        (sortSymbolsUtils.default as jest.Mock).mockImplementationOnce(() => [
            { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
            { symbol: 'GBPUSD', display_name: 'GBP/USD', exchange_is_open: 0 },
        ]);

        const { result } = renderHook(() => useGetSymbolSearchResults('s'));
        expect(result.current).toEqual([
            { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
            { symbol: 'GBPUSD', display_name: 'GBP/USD', exchange_is_open: 0 },
        ]);
    });
    it('should return empty array if searchValue does not match any symbols', () => {
        (sortSymbolsUtils.default as jest.Mock).mockImplementationOnce(() => []);

        const { result } = renderHook(() => useGetSymbolSearchResults('test'));
        expect(result.current).toEqual([]);
    });
});
