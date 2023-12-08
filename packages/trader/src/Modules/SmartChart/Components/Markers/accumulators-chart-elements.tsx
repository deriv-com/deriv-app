import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers/positions-helper';
import React from 'react';
import AccumulatorsProfitLossTooltip from './accumulators-profit-loss-tooltip';
import { ProposalOpenContract } from '@deriv/api-types';
import { TRADE_TYPES } from '@deriv/shared';
import ChartMarkerBeta from 'Modules/SmartChartBeta/Components/Markers/marker.jsx';
import ChartMarker from './marker';

type TPositions = {
    contract_info: Omit<
        React.ComponentProps<typeof AccumulatorsProfitLossTooltip>,
        'className' | 'alignment' | 'should_show_profit_text'
    > &
        Required<Pick<ProposalOpenContract, 'underlying' | 'shortcode' | 'contract_id' | 'contract_type'>>;
};

type TAccumulatorsChartElements = {
    all_positions: TPositions[];
    current_spot: number;
    current_spot_time: number;
    has_crossed_accu_barriers: boolean;
    should_show_profit_text: React.ComponentProps<typeof AccumulatorsProfitLossTooltip>['should_show_profit_text'];
    symbol: string;
    is_beta_chart?: boolean;
};

const AccumulatorsChartElements = ({
    all_positions,
    current_spot,
    current_spot_time,
    has_crossed_accu_barriers,
    should_show_profit_text,
    symbol,
    is_beta_chart,
}: TAccumulatorsChartElements) => {
    const accumulators_positions = all_positions.filter(
        ({ contract_info }) =>
            contract_info &&
            symbol === contract_info.underlying &&
            filterByContractType(contract_info, TRADE_TYPES.ACCUMULATOR)
    );

    const ChartMarkerComponent = is_beta_chart ? ChartMarkerBeta : ChartMarker;

    return (
        <React.Fragment>
            {!!accumulators_positions.length &&
                accumulators_positions.map(({ contract_info }) => (
                    <AccumulatorsProfitLossTooltip
                        key={contract_info.contract_id}
                        {...contract_info}
                        should_show_profit_text={should_show_profit_text}
                        is_beta_chart={is_beta_chart}
                    />
                ))}
            {has_crossed_accu_barriers && !!current_spot_time && (
                <ChartMarkerComponent
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
