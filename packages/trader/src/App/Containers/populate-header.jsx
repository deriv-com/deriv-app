import React from 'react';
import TogglePositionsMobile from 'App/Components/Elements/TogglePositions/toggle-positions-mobile';
import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';
import { TURBOS } from '@deriv/shared';

const PopulateHeader = observer(() => {
    const { portfolio, client } = useStore();
    const { symbol, contract_type: trade_contract_type } = useTraderStore();
    const { currency: positions_currency } = client;
    const {
        active_positions_count,
        all_positions: positions,
        error: positions_error,
        onClickSell: onPositionsSell,
        onClickCancel: onPositionsCancel,
    } = portfolio;

    const filtered_positions = positions.filter(
        p =>
            p.contract_info &&
            symbol === p.contract_info.underlying &&
            (trade_contract_type.includes('turbos')
                ? filterByContractType(p.contract_info, TURBOS.SHORT) ||
                  filterByContractType(p.contract_info, TURBOS.LONG)
                : filterByContractType(p.contract_info, trade_contract_type))
    );

    return (
        <TogglePositionsMobile
            active_positions_count={active_positions_count}
            currency={positions_currency}
            error={positions_error}
            filtered_positions={filtered_positions}
            is_empty={!filtered_positions.length}
            onClickSell={onPositionsSell}
            onClickCancel={onPositionsCancel}
        />
    );
});

export default PopulateHeader;
