import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useActiveSymbols from '../useActiveSymbols';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../trader-providers';
import { waitFor } from '@testing-library/react';
import { usePrevious } from '@deriv/components';
import { TRADE_TYPES } from '@deriv/shared';

const not_logged_in_active_symbols = [
    { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
    { symbol: 'GBPUSD', display_name: 'GBP/USD', exchange_is_open: 0 },
    { symbol: 'CADAUD', display_name: 'CAD/AUD', exchange_is_open: 0 },
];
const logged_in_active_symbols = [
    { symbol: '1HZ100', display_name: 'Volatility 100', exchange_is_open: 1 },
    { symbol: '1HZ200', display_name: 'Volatility 200', exchange_is_open: 0 },
    { symbol: '1HZ300', display_name: 'Volatility 300', exchange_is_open: 0 },
];

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            activeSymbols: jest.fn(() => Promise.resolve({ active_symbols: logged_in_active_symbols, error: null })),
        },
        activeSymbols: jest.fn(() => Promise.resolve({ active_symbols: not_logged_in_active_symbols, error: null })),
    },
    pickDefaultSymbol: jest.fn(() => Promise.resolve('EURUSD')),
}));

jest.mock('@deriv/components', () => ({
    usePrevious: jest.fn(),
}));

describe('useActiveSymbols', () => {
    let mocked_store: ReturnType<typeof mockStore>;
    const wrapper = ({ children }: { children: JSX.Element }) => {
        return <TraderProviders store={mocked_store}>{children}</TraderProviders>;
    };
    beforeEach(() => {
        mocked_store = {
            ...mockStore({}),
            client: {
                ...mockStore({}).client,
                is_logged_in: false,
            },
            modules: {
                trade: {
                    active_symbols: not_logged_in_active_symbols,
                    has_symbols_for_v2: true,
                    contract_type: TRADE_TYPES.RISE_FALL,
                    onChange: jest.fn(),
                    setActiveSymbolsV2: jest.fn(),
                    symbol: '',
                },
            },
        };
        mocked_store.client.is_logged_in = false;
        jest.clearAllMocks();
    });
    it('should fetch active symbols when not logged in', async () => {
        // Need the opposite return value (true) of usePrevious(is_logged_in) for fetchActiveSymbols to trigger:
        (usePrevious as jest.Mock).mockReturnValueOnce(true).mockReturnValueOnce(TRADE_TYPES.RISE_FALL);
        const { result } = renderHook(() => useActiveSymbols({ barrier_category: [] }), {
            wrapper,
        });
        await waitFor(() => {
            expect(result.current.activeSymbols).toEqual(not_logged_in_active_symbols);
        });
    });
    it('should fetch active symbols when logged in', async () => {
        (usePrevious as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(TRADE_TYPES.RISE_FALL);
        mocked_store.client.is_logged_in = true;
        mocked_store.modules.trade.active_symbols = logged_in_active_symbols;
        mocked_store.modules.trade.has_symbols_for_v2 = true;
        const { result } = renderHook(() => useActiveSymbols({ barrier_category: [] }), {
            wrapper,
        });
        await waitFor(() => {
            expect(result.current.activeSymbols).toEqual(logged_in_active_symbols);
        });
    });
    it('should set correct default_symbol and call correct onChange when store symbol is not set', async () => {
        (usePrevious as jest.Mock).mockReturnValueOnce(true).mockReturnValueOnce(TRADE_TYPES.RISE_FALL);
        const { result } = renderHook(() => useActiveSymbols({ barrier_category: [] }), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.default_symbol).toEqual('EURUSD');
            expect(mocked_store.modules.trade.onChange).toHaveBeenCalledWith({
                target: { name: 'symbol', value: 'EURUSD' },
            });
        });
    });
    it('should set correct default_symbol and call correct onChange when store symbol is set', async () => {
        (usePrevious as jest.Mock).mockReturnValueOnce(true).mockReturnValueOnce(TRADE_TYPES.RISE_FALL);
        mocked_store.modules.trade.symbol = 'test';
        const { result } = renderHook(() => useActiveSymbols({ barrier_category: [] }), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.default_symbol).toEqual('test');
            expect(mocked_store.modules.trade.onChange).toHaveBeenCalledWith({
                target: { name: 'symbol', value: 'test' },
            });
        });
    });
    it('should set active symbols from store when is_logged_in and contract_type are unchanged', async () => {
        (usePrevious as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(TRADE_TYPES.RISE_FALL);
        mocked_store.modules.trade.active_symbols = [{ symbol: 'fromStore' }];
        mocked_store.modules.trade.has_symbols_for_v2 = true;
        const { result } = renderHook(() => useActiveSymbols({ barrier_category: [] }), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.activeSymbols).toEqual([{ symbol: 'fromStore' }]);
        });
    });
});
