import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers/positions-helper.js';
import React from 'react';
import AccumulatorsProfitLossTooltip from './accumulators-profit-loss-tooltip';
import CurrentSpotEmphasizer from './current-spot-emphasizer.jsx';
import { ProposalOpenContract } from '@deriv/api-types';

type TAccuContractType = {
    contract_info: Omit<React.ComponentProps<typeof AccumulatorsProfitLossTooltip>, 'className' | 'alignment'> &
        Required<Pick<ProposalOpenContract, 'underlying' | 'shortcode' | 'contract_id' | 'contract_type'>>;
};

type TAccumulatorsChartElements = {
    all_positions: TAccuContractType[];
    current_symbol_spot?: number | null;
    current_symbol_spot_time: number;
    should_highlight_current_spot: boolean;
    symbol: string;
};

const AccumulatorsChartElements = ({
    all_positions,
    current_symbol_spot,
    current_symbol_spot_time,
    should_highlight_current_spot,
    symbol,
}: TAccumulatorsChartElements) => {
    const accumulators_positions = all_positions.filter(
        ({ contract_info }) =>
            contract_info && symbol === contract_info.underlying && filterByContractType(contract_info, 'accumulator')
    );

    return (
        <React.Fragment>
            {!!accumulators_positions.length &&
                accumulators_positions.map(({ contract_info }: TAccuContractType) => (
                    <AccumulatorsProfitLossTooltip key={contract_info.contract_id} {...contract_info} />
                ))}
            {should_highlight_current_spot && current_symbol_spot_time && (
                <CurrentSpotEmphasizer
                    current_spot={current_symbol_spot}
                    current_spot_time={current_symbol_spot_time}
                />
            )}
        </React.Fragment>
    );
};

export default React.memo(AccumulatorsChartElements);
