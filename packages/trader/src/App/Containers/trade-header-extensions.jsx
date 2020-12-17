import PropTypes from 'prop-types';
import React from 'react';
import { when } from 'mobx';
import { MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import TogglePositionsMobile from 'App/Components/Elements/TogglePositions/toggle-positions-mobile.jsx';
import { connect, MobxContentProvider } from 'Stores/connect';
import { WS } from 'Services/ws-methods';

const TradeHeaderExtensions = ({
    active_positions_count,
    disableApp,
    enableApp,
    is_logged_in,
    is_positions_empty,
    onMountCashier,
    onMountPositions,
    onPositionsCancel,
    onPositionsRemove,
    onPositionsSell,
    onUnmountPositions,
    populateHeaderExtensions,
    positions_currency,
    positions_error,
    positions,
    setAccountSwitchListener,
    store,
}) => {
    const populateHeader = () => {
        const header_items = is_logged_in && (
            <MobileWrapper>
                <MobxContentProvider store={store}>
                    <TogglePositionsMobile
                        active_positions_count={active_positions_count}
                        all_positions={positions}
                        currency={positions_currency}
                        disableApp={disableApp}
                        is_empty={is_positions_empty}
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
    };

    React.useEffect(() => {
        const waitForLogin = async () => {
            if (isMobile()) {
                const { client } = store;
                // Waits for login to complete
                await when(() => !client.is_populating_account_list);
                if (is_logged_in) {
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
            if (isMobile()) onUnmountPositions();
            populateHeaderExtensions(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        populateHeader();
    });

    return null;
};

TradeHeaderExtensions.propTypes = {
    is_logged_in: PropTypes.bool,
    populateHeaderExtensions: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    positions_currency: client.currency,
    is_logged_in: client.is_logged_in,
    positions: modules.portfolio.all_positions,
    positions_error: modules.portfolio.error,
    is_positions_empty: modules.portfolio.is_empty,
    onPositionsSell: modules.portfolio.onClickSell,
    onPositionsRemove: modules.portfolio.removePositionById,
    onPositionsCancel: modules.portfolio.onClickCancel,
    onMountCashier: modules.cashier.onMountCommon,
    onMountPositions: modules.portfolio.onMount,
    onUnmountPositions: modules.portfolio.onUnmount,
    active_positions_count: modules.portfolio.active_positions_count,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    populateHeaderExtensions: ui.populateHeaderExtensions,
    toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
    setAccountSwitchListener: modules.cashier.setAccountSwitchListener,
}))(TradeHeaderExtensions);
