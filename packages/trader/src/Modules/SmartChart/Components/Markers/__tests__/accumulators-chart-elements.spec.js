import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsChartElements from '../accumulators-chart-elements';

jest.mock('App/Components/Elements/PositionsDrawer/helpers/positions-helper.js', () => ({
    filterByContractType: jest.fn(() => true),
}));
jest.mock('../accumulators-profit-loss-tooltip.jsx', () => () => <div>AccumulatorsProfitLossTooltip</div>);
jest.mock('../current-spot-highlighter.jsx', () => () => <div>CurrentSpotHighlighter</div>);

describe('AccumulatorsChartElements', () => {
    const mock_props = {
        all_positions: [
            { contract_info: { underlying: 'test symbol', contract_type: 'ACCU', entry_spot: 9722, contract_id: 1 } },
            { contract_info: { underlying: 'test symbol', contract_type: 'ACCU', entry_spot: 9721, contract_id: 2 } },
        ],
        current_symbol_spot_time: 9724,
        is_stats_highlighted: false,
        symbol: 'test symbol',
    };

    it('should render AccumulatorsChartElements without CurrentSpotHighlighter', () => {
        render(<AccumulatorsChartElements {...mock_props} />);

        const tooltip_arr = screen.getAllByText('AccumulatorsProfitLossTooltip');
        expect(tooltip_arr.length).toBe(2);
        expect(screen.queryByText('CurrentSpotHighlighter')).not.toBeInTheDocument();
    });

    it('should render AccumulatorsChartElements with CurrentSpotHighlighter', () => {
        mock_props.is_stats_highlighted = true;
        render(<AccumulatorsChartElements {...mock_props} />);

        const tooltip_arr = screen.getAllByText('AccumulatorsProfitLossTooltip');
        expect(tooltip_arr.length).toBe(2);
        expect(screen.getByText('CurrentSpotHighlighter')).toBeInTheDocument();
    });
});
