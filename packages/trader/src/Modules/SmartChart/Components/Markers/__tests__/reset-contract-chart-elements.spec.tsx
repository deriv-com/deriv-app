import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockContractInfo, CONTRACT_TYPES } from '@deriv/shared';
import ResetContractChartElements from '../reset-contract-chart-elements';

const reset_marker = 'Reset Marker';

jest.mock('../marker', () =>
    jest.fn(({ marker_content_props, marker_config }) => (
        <div>
            <div className={marker_content_props.className}>{reset_marker}</div>
            <div>Y-axis: {marker_config.y}</div>
        </div>
    ))
);

describe('<ResetContractChartElements />', () => {
    let mocked_props: React.ComponentProps<typeof ResetContractChartElements>;
    beforeEach(() => {
        mocked_props = {
            contract_info: mockContractInfo({
                contract_type: CONTRACT_TYPES.RESET.CALL,
                entry_spot: 2035.67,
                reset_time: 1701947743,
                reset_barrier: '2030.28',
            }),
        };
    });

    it('should render 2 markers for Reset contract', () => {
        render(<ResetContractChartElements {...mocked_props} />);

        expect(screen.getAllByText(reset_marker)).toHaveLength(2);
    });
    it('should apply specific className for CONTRACT_TYPES.RESET.CALL', () => {
        render(<ResetContractChartElements {...mocked_props} />);

        expect(screen.getAllByText(reset_marker)[0]).toHaveClass('sc-barrier_gradient sc-barrier_gradient--to-bottom');
    });
    it('should apply specific className for CONTRACT_TYPES.RESET.PUT', () => {
        mocked_props.contract_info.contract_type = CONTRACT_TYPES.RESET.PUT;
        render(<ResetContractChartElements {...mocked_props} />);

        expect(screen.getAllByText(reset_marker)[0]).toHaveClass('sc-barrier_gradient sc-barrier_gradient--to-top');
    });
    it('for CONTRACT_TYPES.RESET.CALL, Y-axis coordinate should be the lowest barrier value among entry_spot and reset_barrier', () => {
        render(<ResetContractChartElements {...mocked_props} />);

        expect(screen.getAllByText(/y-axis/i)[0]).toHaveTextContent('Y-axis: 2030.28');
    });
    it('for CONTRACT_TYPES.RESET.PUT, Y-axis coordinate should be the highest barrier value among entry_spot and reset_barrier', () => {
        mocked_props.contract_info.contract_type = CONTRACT_TYPES.RESET.PUT;
        render(<ResetContractChartElements {...mocked_props} />);

        expect(screen.getAllByText(/y-axis/i)[0]).toHaveTextContent('Y-axis: 2035.67');
    });
});
