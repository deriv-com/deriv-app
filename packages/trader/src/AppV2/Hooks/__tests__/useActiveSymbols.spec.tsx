import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useActiveSymbols from '../useActiveSymbols';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../trader-providers';
import { waitFor } from '@testing-library/react';
import { CONTRACT_TYPES, TRADE_TYPES, WS } from '@deriv/shared';
import { invalidateDTraderCache } from '../useDtraderQuery';

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
            send: jest.fn(() => {
                return Promise.resolve({
                    active_symbols: mocked_store.client.is_logged_in
                        ? logged_in_active_symbols
                        : not_logged_in_active_symbols,
                    error: null,
                });
            }),
        },
        send: jest.fn(() => Promise.resolve({ active_symbols: not_logged_in_active_symbols, error: null })),
    },
    pickDefaultSymbol: jest.fn(() => Promise.resolve('EURUSD')),
}));

jest.mock('@deriv/components', () => ({
    usePrevious: jest.fn(),
}));

jest.mock('AppV2/Hooks/useContractsForCompany', () => ({
    ...jest.requireActual('AppV2/Hooks/useContractsForCompany'),
    __esModule: true,
    default: jest.fn(() => ({
        available_contract_types: [{ contract_type: 'accumulator' }, { contract_type: 'rise_fall' }],
        is_fetching_ref: { current: false },
    })),
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

    afterEach(() => {
        invalidateDTraderCache([
            'active_symbols',
            mocked_store.client.loginid ?? '',
            mocked_store.modules.trade.contract_type,
            mocked_store.common.current_language,
        ]);
    });

    it('should fetch active symbols when not logged in', async () => {
        const { result } = renderHook(() => useActiveSymbols(), {
            wrapper,
        });
        await waitFor(() => {
            expect(result.current.activeSymbols).toEqual(not_logged_in_active_symbols);
        });
    });
    it('should fetch active symbols when logged in', async () => {
        mocked_store.client.is_logged_in = true;
        mocked_store.modules.trade.active_symbols = logged_in_active_symbols;
        mocked_store.modules.trade.has_symbols_for_v2 = true;
        const { result } = renderHook(() => useActiveSymbols(), {
            wrapper,
        });
        await waitFor(() => {
            expect(result.current.activeSymbols).toEqual(logged_in_active_symbols);
        });
    });
    it('should set active symbols from store when is_logged_in and contract_type are unchanged', async () => {
        mocked_store.modules.trade.active_symbols = [{ symbol: 'fromStore' }];
        mocked_store.modules.trade.has_symbols_for_v2 = true;
        const { result } = renderHook(() => useActiveSymbols(), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.activeSymbols).toEqual([{ symbol: 'fromStore' }]);
        });
    });
    it('should call active_symbols API for Vanillas if previous contract is not Vanillas', async () => {
        mocked_store.modules.trade.is_vanilla = true;
        const active_symbols_call_spy = jest.spyOn(WS.authorized, 'send');
        renderHook(() => useActiveSymbols(), { wrapper });

        await waitFor(() => {
            expect(active_symbols_call_spy).toBeCalledWith({
                active_symbols: 'brief',
                contract_type: [CONTRACT_TYPES.VANILLA.CALL, CONTRACT_TYPES.VANILLA.PUT],
            });
        });
    });
    it('should not call active_symbols API for Vanillas if previous contract is Vanillas', async () => {
        mocked_store.modules.trade.contract_type = 'vanillascall';
        mocked_store.modules.trade.is_vanilla = true;
        const active_symbols_call_spy = jest.spyOn(WS.authorized, 'send');
        renderHook(() => useActiveSymbols(), { wrapper });

        mocked_store.modules.trade.contract_type = 'vanillasput';

        await waitFor(() => {
            expect(active_symbols_call_spy).toBeCalledTimes(1);
        });
    });
    it('should call active_symbols API for Turbos if previous contract is not Turbos', async () => {
        mocked_store.modules.trade.is_turbos = true;
        const active_symbols_call_spy = jest.spyOn(WS.authorized, 'send');
        renderHook(() => useActiveSymbols(), { wrapper });

        await waitFor(() => {
            expect(active_symbols_call_spy).toBeCalledWith({
                active_symbols: 'brief',
                contract_type: [CONTRACT_TYPES.TURBOS.LONG, CONTRACT_TYPES.TURBOS.SHORT],
            });
        });
    });
    it('should not call active_symbols API for Turbos if previous contract is Turbos', async () => {
        mocked_store.modules.trade.contract_type = 'turboslong';
        mocked_store.modules.trade.is_turbos = true;
        const active_symbols_call_spy = jest.spyOn(WS.authorized, 'send');
        renderHook(() => useActiveSymbols(), { wrapper });

        mocked_store.modules.trade.contract_type = 'turbosshort';

        await waitFor(() => {
            expect(active_symbols_call_spy).toBeCalledTimes(1);
        });
    });

    it('should call active_symbols API for Turbos if contract is changed', async () => {
        mocked_store.modules.trade.contract_type = 'contract_type1';
        mocked_store.modules.trade.is_turbos = true;
        const active_symbols_call_spy = jest.spyOn(WS.authorized, 'send');
        renderHook(() => useActiveSymbols(), { wrapper });

        mocked_store.modules.trade.contract_type = 'contract_type2';

        await waitFor(() => {
            expect(active_symbols_call_spy).toBeCalledTimes(2);
        });
    });
});
