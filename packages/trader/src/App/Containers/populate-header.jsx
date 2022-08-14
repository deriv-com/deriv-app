import React from 'react';
import TogglePositionsMobile from 'App/Components/Elements/TogglePositions/toggle-positions-mobile.jsx';
import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers';
import { connect } from 'Stores/connect';
import { isMobile, routes, WS } from '@deriv/shared';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import { when } from 'mobx';
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
    is_logged_in,
    is_populating_account_list,
    onMountPositions,
    onMountCashier,
    setAccountSwitchListener,
}) => {
    const [populate_header, setPopulateHeader] = React.useState(false);
    const show_positions_toggle = location.pathname !== routes.mt5;

    React.useEffect(() => {
        const waitForLogin = async () => {
            if (isMobile() && show_positions_toggle) {
                await when(() => !is_populating_account_list);
                if (is_logged_in) {
                    await WS.wait('authorize');
                    onMountPositions();
                    onMountCashier(true);
                    setAccountSwitchListener();
                }
            }
            setPopulateHeader(true);
        };

        waitForLogin();
    }, []);

    const symbol_positions = positions.filter(
        p =>
            p.contract_info &&
            symbol === p.contract_info.underlying &&
            filterByContractType(p.contract_info, trade_contract_type)
    );

    const show_component = populate_header && is_logged_in && show_positions_toggle;

    if (show_component) {
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
    }
    return <></>;
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
    is_logged_in: PropTypes.bool,
    is_populating_account_list: PropTypes.bool,
    onMountPositions: PropTypes.func,
    onMountCashier: PropTypes.func,
    setAccountSwitchListener: PropTypes.func,
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
    is_logged_in: client.is_logged_in,
    is_populating_account_list: client.is_populating_account_list,
    onMountPositions: portfolio.onMount,
    onMountCashier: modules.cashier.general_store.onMountCommon,
    setAccountSwitchListener: modules.cashier.general_store.setAccountSwitchListener,
}))(PopulateHeader);
