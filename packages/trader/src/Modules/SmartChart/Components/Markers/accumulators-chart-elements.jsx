import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers/positions-helper.js';
import PropTypes from 'prop-types';
import React from 'react';
import AccumulatorsProfitLossTooltip from './accumulators-profit-loss-tooltip.jsx';
import ChartMarker from './marker.jsx';
import classNames from 'classnames';

const AccumulatorsChartElements = ({
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
                    <React.Fragment key={contract_info.contract_id}>
                        <AccumulatorsProfitLossTooltip
                            {...contract_info}
                            should_show_profit_text={should_show_profit_text}
                        />
                        {!!contract_info.is_sold && (
                            <React.Fragment>
                                <ChartMarker
                                    marker_config={{
                                        ContentComponent: 'div',
                                        x: contract_info.exit_tick_time,
                                        y: contract_info.high_barrier,
                                    }}
                                    marker_content_props={{
                                        className: classNames('sc-accu-high-barrier', {
                                            'sc-accu-high-barrier--lost': contract_info.profit <= 0,
                                        }),
                                    }}
                                />
                                <ChartMarker
                                    marker_config={{
                                        ContentComponent: 'div',
                                        x: contract_info.exit_tick_time,
                                        y: contract_info.low_barrier,
                                    }}
                                    marker_content_props={{
                                        className: classNames('sc-accu-low-barrier', {
                                            'sc-accu-low-barrier--lost': contract_info.profit <= 0,
                                        }),
                                    }}
                                />
                            </React.Fragment>
                        )}
                    </React.Fragment>
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
    should_show_profit_text: PropTypes.bool,
    symbol: PropTypes.string,
};

export default React.memo(AccumulatorsChartElements);
