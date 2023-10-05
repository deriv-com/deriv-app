import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers/positions-helper.js';
import PropTypes from 'prop-types';
import React from 'react';
import AccumulatorsProfitLossTooltipAlpha from './accumulators-profit-loss-tooltip.jsx';
import ChartMarkerAlpha from './marker.jsx';

const AccumulatorsChartElementsAlpha = ({
    all_positions,
    current_spot,
    current_spot_time,
    has_crossed_accu_barriers,
    should_show_profit_text,
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
                    <AccumulatorsProfitLossTooltipAlpha
                        key={contract_info.contract_id}
                        {...contract_info}
                        should_show_profit_text={should_show_profit_text}
                    />
                ))}
            {has_crossed_accu_barriers && !!current_spot_time && (
                <ChartMarkerAlpha
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

AccumulatorsChartElementsAlpha.propTypes = {
    all_positions: PropTypes.array,
    current_spot: PropTypes.number,
    current_spot_time: PropTypes.number,
    has_crossed_accu_barriers: PropTypes.bool,
    should_show_profit_text: PropTypes.bool,
    symbol: PropTypes.string,
};

export default React.memo(AccumulatorsChartElementsAlpha);
