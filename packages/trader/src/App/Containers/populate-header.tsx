import React from 'react';
import TogglePositionsMobile from 'App/Components/Elements/TogglePositions/toggle-positions-mobile';
import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';
import { TRADE_TYPES, isTurbosContract, isVanillaContract, isContractSupportedAndStarted } from '@deriv/shared';

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
            isContractSupportedAndStarted(symbol, p.contract_info) &&
            (isTurbosContract(trade_contract_type) || isVanillaContract(trade_contract_type)
                ? filterByContractType(
                      p.contract_info,
                      isTurbosContract(trade_contract_type) ? TRADE_TYPES.TURBOS.SHORT : TRADE_TYPES.VANILLA.CALL
                  ) ||
                  filterByContractType(
                      p.contract_info,
                      isTurbosContract(trade_contract_type) ? TRADE_TYPES.TURBOS.LONG : TRADE_TYPES.VANILLA.PUT
                  )
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
