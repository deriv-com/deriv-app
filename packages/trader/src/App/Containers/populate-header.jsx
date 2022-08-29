import React from 'react';
import TogglePositionsMobile from 'App/Components/Elements/TogglePositions/toggle-positions-mobile.jsx';
import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers';
import { connect } from 'Stores/connect';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';

const PopulateHeader = ({
    active_positions_count,
    positions,
    positions_currency,
    disableApp,
    enableApp,
    positions_error,
    onPositionsSell,
    onPositionsRemove,
    onPositionsCancel,
    symbol,
    trade_contract_type,
}) => {
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
};

PopulateHeader.propTypes = {
    active_positions_count: PropTypes.number,
    positions: MobxPropTypes.arrayOrObservableArray,
    positions_currency: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    positions_error: PropTypes.string,
    onPositionsSell: PropTypes.func,
    onPositionsRemove: PropTypes.func,
    onPositionsCancel: PropTypes.func,
    symbol: PropTypes.string,
    trade_contract_type: PropTypes.string,
};

export default connect(({ client, modules, ui, portfolio }) => ({
    active_positions_count: portfolio.active_positions_count,
    positions: portfolio.all_positions,
    positions_currency: client.currency,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    positions_error: portfolio.error,
    onPositionsSell: portfolio.onClickSell,
    onPositionsRemove: portfolio.removePositionById,
    onPositionsCancel: portfolio.onClickCancel,
    symbol: modules.trade.symbol,
    trade_contract_type: modules.trade.contract_type,
}))(PopulateHeader);
