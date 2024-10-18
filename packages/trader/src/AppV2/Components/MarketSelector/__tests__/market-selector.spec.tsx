import React from 'react';
import { render, screen } from '@testing-library/react';
import MarketSelector from '../market-selector';
import TraderProviders from '../../../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';

jest.mock('AppV2/Hooks/useActiveSymbols', () => ({
    ...jest.requireActual('AppV2/Hooks/useActiveSymbols'),
    __esModule: true,
    default: jest.fn(() => ({
        activeSymbols: [
            { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
            { symbol: 'GBPUSD', display_name: 'GBP/USD', exchange_is_open: 0 },
            { symbol: 'CADAUD', display_name: 'CAD/AUD', exchange_is_open: 0 },
        ],
    })),
}));
jest.mock('AppV2/Components/ActiveSymbolsList', () => jest.fn(() => 'MockedActiveSymbolsList'));

describe('MarketSelector', () => {
    let default_trade_store: TCoreStores;

    beforeEach(() => {
        default_trade_store = mockStore({
            modules: {
                trade: {
                    symbol: 'EURUSD',
                    tick_data: {
                        quote: 1234.23,
                        pip_size: 2,
                    },
                },
            },
        });
    });

    const MockedMarketSelector = () => {
        return (
            <TraderProviders store={default_trade_store}>
                <MarketSelector />
            </TraderProviders>
        );
    };

    it('renders storeSymbol when storeSymbol is set', () => {
        render(MockedMarketSelector());

        expect(screen.getByText('EUR/USD')).toBeInTheDocument();
        expect(screen.getByText(default_trade_store.modules.trade.tick_data.quote)).toBeInTheDocument();
    });
    it('renders CLOSED when current symbol exchange_is_open is 0', () => {
        default_trade_store.modules.trade.symbol = 'GBPUSD';
        render(MockedMarketSelector());

        expect(screen.getByText('GBP/USD')).toBeInTheDocument();
        expect(screen.getByText(default_trade_store.modules.trade.tick_data.quote)).toBeInTheDocument();
        expect(screen.getByText('CLOSED')).toBeInTheDocument();
    });
    it('renders loader when current symbol exchange_is_open is not defined (is not among active symbols list)', () => {
        default_trade_store.modules.trade.symbol = 'USDJPY';
        render(MockedMarketSelector());

        expect(screen.getByTestId('square-skeleton')).toBeInTheDocument();
    });
    it('renders loader instead of current spot when tick_data is empty', () => {
        default_trade_store.modules.trade.tick_data = {};
        render(MockedMarketSelector());

        expect(screen.getByTestId('square-skeleton')).toBeInTheDocument();
    });
    it('renders dash instead of current spot when market is closed and tick_data is empty', () => {
        default_trade_store.modules.trade.symbol = 'GBPUSD';
        default_trade_store.modules.trade.is_market_closed = true;
        default_trade_store.modules.trade.tick_data = {};
        render(MockedMarketSelector());

        expect(screen.getByText('-')).toBeInTheDocument();
    });
});
