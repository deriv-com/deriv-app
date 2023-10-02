import React from 'react';
import TogglePositionsMobile from 'App/Components/Elements/TogglePositions/toggle-positions-mobile.jsx';
import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';
import { TURBOS, VANILLALONG, isTurbosContract, isVanillaContract } from '@deriv/shared';

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
        onClickCancel: onPositionsCancel,
    } = portfolio;

    const filtered_positions = positions.filter(
        p =>
            p.contract_info &&
            symbol === p.contract_info.underlying &&
            (isTurbosContract(trade_contract_type) || isVanillaContract(trade_contract_type)
                ? filterByContractType(
                      p.contract_info,
                      isTurbosContract(trade_contract_type) ? TURBOS.SHORT : VANILLALONG.CALL
                  ) ||
                  filterByContractType(
                      p.contract_info,
                      isTurbosContract(trade_contract_type) ? TURBOS.LONG : VANILLALONG.PUT
                  )
                : filterByContractType(p.contract_info, trade_contract_type))
    );

    return (
        <TogglePositionsMobile
            active_positions_count={active_positions_count}
            filtered_positions={filtered_positions}
            currency={positions_currency}
            disableApp={disableApp}
            is_empty={!filtered_positions.length}
            enableApp={enableApp}
            error={positions_error}
            onClickSell={onPositionsSell}
            onClickCancel={onPositionsCancel}
        />
    );
});

export default PopulateHeader;
