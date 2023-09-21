import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QuickStrategy from '../quick-strategy';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    blocksCoordinate: jest.fn(),
    ApiHelpers: {
        instance: {
            contracts_for: {
                '1HZ10V': {
                    contracts: [
                        {
                            barrier_category: 'asian',
                            barriers: 0,
                            contract_category: 'asian',
                            contract_category_display: 'Asians',
                            contract_display: 'Asian Up',
                            contract_type: 'ASIANU',
                            exchange_name: 'RANDOM',
                            expiry_type: 'tick',
                            market: 'synthetic_index',
                            max_contract_duration: '10t',
                            min_contract_duration: '5t',
                            sentiment: 'up',
                            start_type: 'spot',
                            submarket: 'random_index',
                            underlying_symbol: '1HZ10V',
                        },
                    ],
                },
                getMarketBySymbol: jest.fn(),
                getSubmarketBySymbol: jest.fn(),
                getTradeTypeCategories: jest.fn().mockResolvedValue([
                    ['Up/Down', 'callput'],
                    ['Touch/No Touch', 'touchnotouch'],
                    ['In/Out', 'inout'],
                    ['Asians', 'asian'],
                    ['Digits', 'digits'],
                    ['High/Low Ticks', 'highlowticks'],
                    ['Only Ups/Only Downs', 'runs'],
                    ['Multipliers', 'multiplier'],
                ]),
                getDurations: jest.fn().mockResolvedValue([]),
                getTradeTypeByTradeCategory: jest.fn().mockReturnValue([
                    {
                        name: 'Rise/Fall',
                        value: 'callput',
                        icon: ['CALL', 'PUT'],
                    },
                ]),
            },
            active_symbols: {
                active_symbols: [
                    {
                        allow_forward_starting: 1,
                        display_name: 'Volatility 10 (1s) Index',
                        display_order: 2,
                        exchange_is_open: 1,
                        is_trading_suspended: 0,
                        market: 'synthetic_index',
                        market_display_name: 'Derived',
                        pip: 0.01,
                        subgroup: 'synthetics',
                        subgroup_display_name: 'Synthetics',
                        submarket: 'random_index',
                        submarket_display_name: 'Continuous Indices',
                        symbol: '1HZ10V',
                        symbol_type: 'stockindex',
                    },
                ],
                getAllSymbols: jest.fn().mockReturnValue([
                    {
                        allow_forward_starting: 1,
                        display_name: 'Volatility 10 (1s) Index',
                        display_order: 2,
                        exchange_is_open: 1,
                        is_trading_suspended: 0,
                        market: 'synthetic_index',
                        market_display_name: 'Derived',
                        pip: 0.01,
                        subgroup: 'synthetics',
                        subgroup_display_name: 'Synthetics',
                        submarket: 'random_index',
                        submarket_display_name: 'Continuous Indices',
                        symbol: '1HZ10V',
                        symbol_type: 'stockindex',
                    },
                ]),
                disabled_symbols_for_quick_strategy: ['1HZ150V', '1HZ250V'],
                disabled_submarkets_for_quick_strategy: ['crash_index', 'non_stable_coin'],
            },
        },
    },
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
}));

describe('QuickStrategy', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render QuickStrategy', () => {
        mock_DBot_store!.quick_strategy.loadDataStrategy();
        const { container } = render(<QuickStrategy />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });
});
