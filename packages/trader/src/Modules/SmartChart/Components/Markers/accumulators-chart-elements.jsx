import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers/positions-helper.js';
import PropTypes from 'prop-types';
import React from 'react';
import AccumulatorsProfitLossTooltip from './accumulators-profit-loss-tooltip.jsx';
import CurrentSpotEmphasizer from './current-spot-emphasizer.jsx';

const AccumulatorsChartElements = ({
    all_positions,
    current_spot,
    current_spot_time,
    has_crossed_accu_barriers,
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
                    <AccumulatorsProfitLossTooltip key={contract_info.contract_id} {...contract_info} />
                ))}
            {has_crossed_accu_barriers && !!current_spot_time && (
                <CurrentSpotEmphasizer current_spot={current_spot} current_spot_time={current_spot_time} />
            )}
        </React.Fragment>
    );
};

AccumulatorsChartElements.propTypes = {
    all_positions: PropTypes.array,
    current_spot: PropTypes.number,
    current_spot_time: PropTypes.number,
    has_crossed_accu_barriers: PropTypes.bool,
    symbol: PropTypes.string,
};

export default React.memo(AccumulatorsChartElements);
