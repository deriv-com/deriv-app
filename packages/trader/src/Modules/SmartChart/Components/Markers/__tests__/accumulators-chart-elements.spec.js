import React from 'react';
import { render, screen } from '@testing-library/react';
import AccumulatorsChartElements from '../accumulators-chart-elements';

jest.mock('App/Components/Elements/PositionsDrawer/helpers/positions-helper.js', () => ({
    filterByContractType: jest.fn(() => true),
}));
jest.mock('../accumulators-profit-loss-tooltip.jsx', () => () => <div>AccumulatorsProfitLossTooltip</div>);
jest.mock('../current-spot-emphasizer.jsx', () => () => <div>CurrentSpotEmphasizer</div>);

describe('AccumulatorsChartElements', () => {
    const mock_props = {
        all_positions: [
            { contract_info: { underlying: 'test symbol', contract_type: 'ACCU', entry_spot: 9454.1, contract_id: 1 } },
            {
                contract_info: {
                    underlying: 'test symbol',
                    contract_type: 'ACCU',
                    entry_spot: 9467.78,
                    contract_id: 2,
                },
            },
        ],
        current_symbol_spot: 9478.34,
        current_symbol_spot_time: 1234567890,
        should_highlight_current_spot: false,
        symbol: 'test symbol',
    };

    it('should render AccumulatorsChartElements without CurrentSpotEmphasizer', () => {
        render(<AccumulatorsChartElements {...mock_props} />);

        const tooltip_arr = screen.getAllByText('AccumulatorsProfitLossTooltip');
        expect(tooltip_arr.length).toBe(2);
        expect(screen.queryByText('CurrentSpotEmphasizer')).not.toBeInTheDocument();
    });

    it('should render AccumulatorsChartElements with CurrentSpotEmphasizer', () => {
        mock_props.should_highlight_current_spot = true;
        render(<AccumulatorsChartElements {...mock_props} />);

        const tooltip_arr = screen.getAllByText('AccumulatorsProfitLossTooltip');
        expect(tooltip_arr.length).toBe(2);
        expect(screen.getByText('CurrentSpotEmphasizer')).toBeInTheDocument();
    });
});
