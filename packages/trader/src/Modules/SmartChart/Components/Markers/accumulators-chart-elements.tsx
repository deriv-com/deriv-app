import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers/positions-helper';
import React from 'react';
import { useStore } from '@deriv/stores';
import AccumulatorsProfitLossTooltip from './accumulators-profit-loss-tooltip';
import ChartMarker from './marker';
import { TRADE_TYPES } from '@deriv/shared';

type TPortfolioStore = ReturnType<typeof useStore>['portfolio'];

type TAccumulatorsChartElements = {
    all_positions: TPortfolioStore['all_positions'];
    current_spot?: number;
    current_spot_time?: number;
    has_crossed_accu_barriers: boolean;
    should_show_profit_text: React.ComponentProps<typeof AccumulatorsProfitLossTooltip>['should_show_profit_text'];
    symbol: string;
    is_mobile?: boolean;
};

const AccumulatorsChartElements = ({
    all_positions,
    current_spot,
    current_spot_time,
    has_crossed_accu_barriers,
    should_show_profit_text,
    symbol,
    is_mobile,
}: TAccumulatorsChartElements) => {
    const accumulators_positions = all_positions.filter(
        ({ contract_info }) =>
            contract_info &&
            symbol === contract_info.underlying &&
            filterByContractType(contract_info, TRADE_TYPES.ACCUMULATOR)
    );

    return (
        <React.Fragment>
            {!!accumulators_positions.length &&
                accumulators_positions.map(({ contract_info }) => (
                    <AccumulatorsProfitLossTooltip
                        key={contract_info.contract_id}
                        {...contract_info}
                        should_show_profit_text={should_show_profit_text}
                        is_mobile={is_mobile}
                    />
                ))}
            {has_crossed_accu_barriers && !!current_spot_time && !!current_spot && (
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

export default React.memo(AccumulatorsChartElements);
