import React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTRACT_TYPES } from '@deriv/shared';
import AccumulatorsChartElements from '../accumulators-chart-elements';

jest.mock('App/Components/Elements/PositionsDrawer/helpers/positions-helper', () => ({
    filterByContractType: jest.fn(() => true),
}));
jest.mock('../accumulators-profit-loss-tooltip', () => jest.fn(() => <div>AccumulatorsProfitLossTooltip</div>));
jest.mock('../marker', () => jest.fn(() => <div>Spot-emphasizing ChartMarker</div>));

describe('AccumulatorsChartElements', () => {
    const mock_props = {
        all_positions: [
            {
                contract_info: {
                    underlying: 'test symbol',
                    contract_type: CONTRACT_TYPES.ACCUMULATOR,
                    entry_spot: 9454.1,
                    contract_id: 1,
                    shortcode: 'test',
                    profit: 100,
                },
            },
            {
                contract_info: {
                    underlying: 'test symbol',
                    contract_type: CONTRACT_TYPES.ACCUMULATOR,
                    entry_spot: 9467.78,
                    contract_id: 2,
                    shortcode: 'test',
                    profit: 120,
                },
            },
        ] as React.ComponentProps<typeof AccumulatorsChartElements>['all_positions'],
        current_spot: 9478.34,
        current_spot_time: 1234567890,
        has_crossed_accu_barriers: false,
        should_show_profit_text: true,
        symbol: 'test symbol',
    };

    it('should render AccumulatorsChartElements without Spot-emphasizing ChartMarker', () => {
        render(<AccumulatorsChartElements {...mock_props} />);
        const tooltip_arr = screen.getAllByText('AccumulatorsProfitLossTooltip');
        expect(tooltip_arr).toHaveLength(2);
        expect(screen.queryByText('Spot-emphasizing ChartMarker')).not.toBeInTheDocument();
    });

    it('should render AccumulatorsChartElements with Spot-emphasizing ChartMarker when has_crossed_accu_barriers = true', () => {
        mock_props.has_crossed_accu_barriers = true;
        render(<AccumulatorsChartElements {...mock_props} />);

        const tooltip_arr = screen.getAllByText('AccumulatorsProfitLossTooltip');
        expect(tooltip_arr).toHaveLength(2);
        expect(screen.getByText('Spot-emphasizing ChartMarker')).toBeInTheDocument();
    });
});
