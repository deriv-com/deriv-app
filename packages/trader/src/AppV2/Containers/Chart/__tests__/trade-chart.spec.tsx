import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import useDefaultSymbol from 'AppV2/Hooks/useDefaultSymbol';
import TraderProviders from '../../../../trader-providers';
import TradeChart from '../trade-chart';

const mock_chart = 'Mocked Chart';

jest.mock('Modules/SmartChart', () => ({
    SmartChart: () => {
        return <div>{mock_chart}</div>;
    },
}));
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(() => ({
        pathname: '/',
    })),
    withRouter: jest.fn(children => <div>{children}</div>),
}));
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));
jest.mock('AppV2/Hooks/useActiveSymbols', () => ({
    ...jest.requireActual('AppV2/Hooks/useActiveSymbols'),
    __esModule: true,
    default: jest.fn(() => ({
        activeSymbols: [{ symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 }],
    })),
}));
jest.mock('AppV2/Hooks/useDefaultSymbol', () => ({
    ...jest.requireActual('AppV2/Hooks/useDefaultSymbol'),
    __esModule: true,
    default: jest.fn(() => ({
        symbol: 'EURUSD',
    })),
}));

describe('TradeChart', () => {
    const mockedTradeChart = () => {
        render(
            <TraderProviders store={mockStore({})}>
                <TradeChart />
            </TraderProviders>
        );
    };

    it('does not render the chart if active_symbols array is empty', () => {
        (useActiveSymbols as jest.Mock).mockReturnValueOnce({
            activeSymbols: [],
        });
        mockedTradeChart();

        expect(screen.queryByText(mock_chart)).not.toBeInTheDocument();
    });

    it('does not render the chart if there is no symbol', () => {
        (useDefaultSymbol as jest.Mock).mockReturnValueOnce({
            symbol: '',
        });
        mockedTradeChart();

        expect(screen.queryByText(mock_chart)).not.toBeInTheDocument();
    });

    it('renders the chart', () => {
        mockedTradeChart();

        expect(screen.getByText(mock_chart)).toBeInTheDocument();
    });
});
