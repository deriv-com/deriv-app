import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../trader-providers';
import { waitFor } from '@testing-library/react';
import { TRADE_TYPES } from '@deriv/shared';

import useDefaultSymbol from '../useDefaultSymbol';

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
    pickDefaultSymbol: jest.fn(() => Promise.resolve('EURUSD')),
}));

jest.mock('AppV2/Hooks/useActiveSymbols', () => ({
    ...jest.requireActual('AppV2/Hooks/useActiveSymbols'),
    __esModule: true,
    default: jest.fn(() => {
        return {
            activeSymbols: mocked_store.client.is_logged_in ? logged_in_active_symbols : not_logged_in_active_symbols,
        };
    }),
}));

let mocked_store: ReturnType<typeof mockStore>;
describe('useActiveSymbols', () => {
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
                    is_turbos: false,
                    is_vanilla: false,
                    contract_type: TRADE_TYPES.RISE_FALL,
                    onChange: jest.fn(),
                    processContractsForV2: jest.fn(),
                    setActiveSymbolsV2: jest.fn(),
                    symbol: '',
                },
            },
        };
        mocked_store.client.is_logged_in = false;
        jest.clearAllMocks();
    });

    it('should set correct default_symbol and call correct onChange when store symbol is not set', async () => {
        const { result } = renderHook(() => useDefaultSymbol(), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.symbol).toEqual('EURUSD');
            expect(mocked_store.modules.trade.onChange).toHaveBeenCalledWith({
                target: { name: 'symbol', value: 'EURUSD' },
            });
        });
    });
    it('should set correct default_symbol based on the symbol availability', async () => {
        mocked_store.modules.trade.symbol = 'test';
        const { result } = renderHook(() => useDefaultSymbol(), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.symbol).toEqual('EURUSD');
        });
    });
});
