import React from 'react';
import PropTypes from 'prop-types';
import { when } from 'mobx';
import { MobileWrapper } from '@deriv/components';
import { isMobile, routes, WS } from '@deriv/shared';
import { connect, MobxContentProvider } from 'Stores/connect';
import PopulateHeader from './populate-header';

const TradeHeaderExtensions = ({
    populateHeaderExtensions,
    store,
    is_logged_in,
    is_populating_account_list,
    onMountPositions,
    onMountCashier,
    setAccountSwitchListener,
}) => {
    const show_positions_toggle = location.pathname !== routes.mt5;
    const show_component = is_logged_in && show_positions_toggle;

    const populateHeaderfunction = React.useCallback(() => {
        const header_items = show_component && (
            <MobileWrapper>
                <MobxContentProvider store={store}>
                    <PopulateHeader />
                </MobxContentProvider>
            </MobileWrapper>
        );

        populateHeaderExtensions(header_items);
    }, [populateHeaderExtensions, store, show_positions_toggle]);

    React.useEffect(() => {
        const waitForLogin = async () => {
            if (isMobile() && show_positions_toggle) {
                await when(() => !is_populating_account_list); // Waits for login to complete
                if (is_logged_in) {
                    await WS.wait('authorize');
                    onMountPositions();
                    onMountCashier(true);
                    setAccountSwitchListener();
                }
            }

            populateHeaderfunction();
        };

        waitForLogin();

        return () => populateHeaderExtensions(null);
    }, [
        onMountCashier,
        onMountPositions,
        populateHeaderfunction,
        populateHeaderExtensions,
        setAccountSwitchListener,
        store,
        show_positions_toggle,
    ]);

    React.useEffect(() => {
        populateHeaderfunction();
    });

    return null;
};

TradeHeaderExtensions.propTypes = {
    populateHeaderExtensions: PropTypes.func,
    store: PropTypes.object,
    is_logged_in: PropTypes.bool,
    is_populating_account_list: PropTypes.bool,
    onMountPositions: PropTypes.func,
    onMountCashier: PropTypes.func,
    setAccountSwitchListener: PropTypes.func,
};

export default connect(({ client, modules, ui, portfolio }) => ({
    populateHeaderExtensions: ui.populateHeaderExtensions,
    is_logged_in: client.is_logged_in,
    is_populating_account_list: client.is_populating_account_list,
    onMountPositions: portfolio.onMount,
    onMountCashier: modules.cashier.general_store.onMountCommon,
    setAccountSwitchListener: modules.cashier.general_store.setAccountSwitchListener,
}))(TradeHeaderExtensions);
