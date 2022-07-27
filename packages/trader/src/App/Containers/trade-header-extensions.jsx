import PropTypes from 'prop-types';
import React from 'react';
import { when } from 'mobx';
import { MobileWrapper } from '@deriv/components';
import { isMobile, routes, WS } from '@deriv/shared';
import TogglePositionsMobile from 'App/Components/Elements/TogglePositions/toggle-positions-mobile.jsx';
import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers';
import { connect, MobxContentProvider } from 'Stores/connect';

const TradeHeaderExtensions = props => {
    const {
        disableApp,
        enableApp,
        onMountCashier,
        onMountPositions,
        onPositionsCancel,
        onPositionsRemove,
        onPositionsSell,
        populateHeaderExtensions,
        setAccountSwitchListener,
        store,
    } = props;

    const props_ref = React.useRef();
    props_ref.current = props;

    const show_positions_toggle = location.pathname !== routes.mt5;

    const populateHeader = React.useCallback(() => {
        const {
            is_logged_in,
            active_positions_count,
            positions,
            positions_currency,
            positions_error,
            trade_contract_type,
            symbol,
        } = props_ref.current;

        const symbol_positions = positions.filter(
            p =>
                p.contract_info &&
                symbol === p.contract_info.underlying &&
                filterByContractType(p.contract_info, trade_contract_type)
        );
        const header_items = is_logged_in && show_positions_toggle && (
            <MobileWrapper>
                <MobxContentProvider store={store}>
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
                </MobxContentProvider>
            </MobileWrapper>
        );

        populateHeaderExtensions(header_items);
    }, [
        disableApp,
        enableApp,
        onPositionsCancel,
        onPositionsRemove,
        onPositionsSell,
        populateHeaderExtensions,
        store,
        show_positions_toggle,
    ]);

    React.useEffect(() => {
        const waitForLogin = async () => {
            if (isMobile() && show_positions_toggle) {
                const { client } = store;
                // Waits for login to complete
                await when(() => !client.is_populating_account_list);
                if (props_ref.current.is_logged_in) {
                    await WS.wait('authorize');
                    onMountPositions();
                    onMountCashier(true);
                    setAccountSwitchListener();
                }
            }

            populateHeader();
        };

        waitForLogin();

        return () => {
            populateHeaderExtensions(null);
        };
    }, [
        onMountCashier,
        onMountPositions,
        populateHeader,
        populateHeaderExtensions,
        setAccountSwitchListener,
        store,
        show_positions_toggle,
    ]);

    React.useEffect(() => {
        populateHeader();
    });

    return null;
};

TradeHeaderExtensions.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_logged_in: PropTypes.bool,
    onMountCashier: PropTypes.func,
    onMountPositions: PropTypes.func,
    onPositionsCancel: PropTypes.func,
    onPositionsRemove: PropTypes.func,
    onPositionsSell: PropTypes.func,
    populateHeaderExtensions: PropTypes.func,
    setAccountSwitchListener: PropTypes.func,
    store: PropTypes.object,
};

export default connect(({ client, modules, ui, portfolio }) => ({
    positions_currency: client.currency,
    is_logged_in: client.is_logged_in,
    positions: portfolio.all_positions,
    onPositionsSell: portfolio.onClickSell,
    positions_error: portfolio.error,
    onPositionsRemove: portfolio.removePositionById,
    onPositionsCancel: portfolio.onClickCancel,
    onMountCashier: modules.cashier.general_store.onMountCommon,
    onMountPositions: portfolio.onMount,
    active_positions_count: portfolio.active_positions_count,
    trade_contract_type: modules.trade.contract_type,
    symbol: modules.trade.symbol,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    populateHeaderExtensions: ui.populateHeaderExtensions,
    toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
    setAccountSwitchListener: modules.cashier.general_store.setAccountSwitchListener,
}))(TradeHeaderExtensions);
