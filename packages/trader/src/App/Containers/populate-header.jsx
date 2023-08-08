import React from 'react';
import TogglePositionsMobile from 'App/Components/Elements/TogglePositions/toggle-positions-mobile.jsx';
import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

const PopulateHeader = observer(() => {
    const { portfolio, ui, client } = useStore();
    const { symbol, contract_type: trade_contract_type } = useTraderStore();
    const { currency: positions_currency } = client;
    const { disableApp, enableApp } = ui;
    const {
        active_positions_count,
        all_positions: positions,
        error: positions_error,
        onClickSell: onPositionsSell,
        removePositionById: onPositionsRemove,
        onClickCancel: onPositionsCancel,
    } = portfolio;

    const symbol_positions = positions.filter(
        p =>
            p.contract_info &&
            symbol === p.contract_info.underlying &&
            filterByContractType(p.contract_info, trade_contract_type)
    );

    return (
        <TogglePositionsMobile
            active_positions_count={active_positions_count}
            all_positions={positions}
            currency={positions_currency}
            disableApp={disableApp}
            is_empty={!symbol_positions.length}
            enableApp={enableApp}
            error={positions_error}
            onClickSell={onPositionsSell}
            onClickRemove={onPositionsRemove}
            onClickCancel={onPositionsCancel}
        />
    );
});

export default PopulateHeader;
