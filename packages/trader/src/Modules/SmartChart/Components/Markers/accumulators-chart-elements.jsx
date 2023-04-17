import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers/positions-helper.js';
import PropTypes from 'prop-types';
import React from 'react';
import AccumulatorsProfitLossTooltip from './accumulators-profit-loss-tooltip.jsx';
import CurrentSpotEmphasizer from './current-spot-emphasizer.jsx';

const AccumulatorsChartElements = ({
    all_positions,
    current_symbol_spot,
    current_symbol_spot_time,
    should_highlight_current_spot,
    symbol,
}) => {
    const accumulators_positions = all_positions.filter(
        ({ contract_info }) =>
            contract_info && symbol === contract_info.underlying && filterByContractType(contract_info, 'accumulator')
    );
    const last_contract_info = accumulators_positions.slice().pop()?.contract_info;
    const should_highlight_tick_without_contract = !!current_symbol_spot_time && should_highlight_current_spot;
    const should_highlight_contract_tick =
        last_contract_info?.status === 'lost' && current_symbol_spot_time === last_contract_info?.exit_tick_time;
    const should_highlight_tick = should_highlight_tick_without_contract || should_highlight_contract_tick;
    const current_spot = should_highlight_contract_tick ? last_contract_info?.exit_tick : current_symbol_spot;
    const current_spot_time = should_highlight_contract_tick
        ? last_contract_info?.exit_tick_time
        : current_symbol_spot_time;

    return (
        <React.Fragment>
            {!!accumulators_positions.length &&
                accumulators_positions.map(({ contract_info }) => (
                    <AccumulatorsProfitLossTooltip key={contract_info.contract_id} {...contract_info} />
                ))}
            {should_highlight_tick && !!current_symbol_spot_time && (
                <CurrentSpotEmphasizer current_spot={current_spot} current_spot_time={current_spot_time} />
            )}
        </React.Fragment>
    );
};

AccumulatorsChartElements.propTypes = {
    all_positions: PropTypes.array,
    current_symbol_spot: PropTypes.number,
    current_symbol_spot_time: PropTypes.number,
    should_highlight_current_spot: PropTypes.bool,
    symbol: PropTypes.string,
};

export default React.memo(AccumulatorsChartElements);
