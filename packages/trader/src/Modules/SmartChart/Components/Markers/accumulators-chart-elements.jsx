import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers/positions-helper.js';
import PropTypes from 'prop-types';
import React from 'react';
import AccumulatorsProfitLossTooltip from './accumulators-profit-loss-tooltip.jsx';
import ChartMarker from './marker.jsx';

const AccumulatorsChartElements = ({
    all_positions,
    current_spot,
    current_spot_time,
    has_crossed_accu_barriers,
    previous_spot_time,
    symbol,
}) => {
    const accumulators_positions = all_positions.filter(
        ({ contract_info }) =>
            contract_info && symbol === contract_info.underlying && filterByContractType(contract_info, 'accumulator')
    );

    return (
        <React.Fragment>
            {!!accumulators_positions.length &&
                accumulators_positions.map(({ contract_info }) => (
                    <AccumulatorsProfitLossTooltip
                        {...contract_info}
                        key={contract_info.contract_id}
                        should_show_profit_text={!!previous_spot_time}
                    />
                ))}
            {has_crossed_accu_barriers && !!current_spot_time && (
                <ChartMarker
                    marker_config={{
                        ContentComponent: 'div',
                        x: current_spot_time,
                        y: current_spot,
                    }}
                    marker_content_props={{ className: 'sc-current-spot-emphasizer' }}
                />
            )}
        </React.Fragment>
    );
};

AccumulatorsChartElements.propTypes = {
    all_positions: PropTypes.array,
    current_spot: PropTypes.number,
    current_spot_time: PropTypes.number,
    has_crossed_accu_barriers: PropTypes.bool,
    previous_spot_time: PropTypes.number,
    symbol: PropTypes.string,
};

export default React.memo(AccumulatorsChartElements);
