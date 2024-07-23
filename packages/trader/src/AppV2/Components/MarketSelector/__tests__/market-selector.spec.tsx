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
        default_symbol: 'CADAUD',
        activeSymbols: [
            { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
            { symbol: 'GBPUSD', display_name: 'GBP/USD', exchange_is_open: 0 },
            { symbol: 'CADAUD', display_name: 'CAD/AUD', exchange_is_open: 0 },
        ],
        fetchActiveSymbols: jest.fn(),
    })),
}));
jest.mock('AppV2/Components/ActiveSymbolsList', () => jest.fn(() => 'MockedActiveSymbolsList'));

describe('MarketSelector', () => {
    const mock_store = {
        modules: {
            trade: {
                symbol: 'EURUSD',
            },
        },
    };
    const MockedMarketSelector = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <MarketSelector />
            </TraderProviders>
        );
    };

    it('should render storeSymbol when storeSymbol is set', () => {
        render(MockedMarketSelector(mockStore(mock_store)));

        expect(screen.getByText('EUR/USD')).toBeInTheDocument();
        expect(screen.getByText('1234')).toBeInTheDocument();
    });
    it('should render CLOSED when current symbol exchange_is_open is 0', () => {
        mock_store.modules.trade.symbol = 'GBPUSD';
        render(MockedMarketSelector(mockStore(mock_store)));

        expect(screen.getByText('GBP/USD')).toBeInTheDocument();
        expect(screen.getByText('1234')).toBeInTheDocument();
        expect(screen.getByText('CLOSED')).toBeInTheDocument();
    });
    it('should render default symbol when storesSymbol is not set', () => {
        mock_store.modules.trade.symbol = '';
        render(MockedMarketSelector(mockStore(mock_store)));

        expect(screen.getByText('CAD/AUD')).toBeInTheDocument();
        expect(screen.getByText('1234')).toBeInTheDocument();
        expect(screen.getByText('CLOSED')).toBeInTheDocument();
    });
});
