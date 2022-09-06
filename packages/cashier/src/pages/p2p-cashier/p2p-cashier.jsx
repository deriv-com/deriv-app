import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getLanguage } from '@deriv/translations';
import { routes, WS } from '@deriv/shared';
import { Loading } from '@deriv/components';
import P2P from '@deriv/p2p';
import { connect } from 'Stores/connect';
import { get, init, timePromise } from 'Utils/server_time';

/* P2P will use the same websocket connection as Deriv/Binary, we need to pass it as a prop */
const P2PCashier = ({
    addNotificationMessage,
    currency,
    current_focus,
    filterNotificationMessages,
    history,
    is_dark_mode_on,
    is_logging_in,
    is_mobile,
    is_virtual,
    local_currency_config,
    location,
    loginid,
    Notifications,
    platform,
    refreshNotifications,
    removeNotificationByKey,
    removeNotificationMessage,
    residence,
    setNotificationCount,
    setCurrentFocus,
    balance,
    setOnRemount,
}) => {
    const [order_id, setOrderId] = React.useState(null);
    const server_time = {
        get,
        init,
        timePromise,
    };

    React.useEffect(() => {
        const url_params = new URLSearchParams(location.search);
        const passed_order_id = url_params.get('order');

        if (passed_order_id) {
            setQueryOrder(passed_order_id);
        }

        return () => setQueryOrder(null);
    }, [location.search, setQueryOrder]);

    const setQueryOrder = React.useCallback(
        input_order_id => {
            const current_query_params = new URLSearchParams(location.search);

            if (current_query_params.has('order')) {
                current_query_params.delete('order');
            }

            if (input_order_id) {
                current_query_params.append('order', input_order_id);
            }

            if (!input_order_id) {
                history.replace({
                    search: '',
                    hash: location.hash,
                });

                setOrderId(null);
            } else if (order_id !== input_order_id) {
                // Changing query params
                history.push({
                    pathname: routes.cashier_p2p,
                    search: current_query_params.toString(),
                    hash: location.hash,
                });

                setOrderId(input_order_id);
            }
        },
        [history, location.hash, location.search, order_id]
    );

    if (is_logging_in) {
        return <Loading is_fullscreen />;
    }

    return (
        <P2P
            addNotificationMessage={addNotificationMessage}
            client={{ currency, local_currency_config, is_virtual, residence, loginid }}
            balance={balance}
            filterNotificationMessages={filterNotificationMessages}
            history={history}
            is_dark_mode_on={is_dark_mode_on}
            is_mobile={is_mobile}
            lang={getLanguage()}
            modal_root_id='modal_root'
            order_id={order_id}
            platform={platform}
            Notifications={Notifications}
            poi_url={routes.proof_of_identity}
            refreshNotifications={refreshNotifications}
            removeNotificationByKey={removeNotificationByKey}
            removeNotificationMessage={removeNotificationMessage}
            server_time={server_time}
            setNotificationCount={setNotificationCount}
            setOnRemount={setOnRemount}
            setOrderId={setQueryOrder}
            should_show_verification={/verification/.test(location.hash)}
            websocket_api={WS}
            current_focus={current_focus}
            setCurrentFocus={setCurrentFocus}
        />
    );
};

P2PCashier.propTypes = {
    addNotificationMessage: PropTypes.func,
    balance: PropTypes.string,
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    filterNotificationMessages: PropTypes.func,
    history: PropTypes.object,
    is_dark_mode_on: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_virtual: PropTypes.bool,
    local_currency_config: PropTypes.object,
    location: PropTypes.object,
    loginid: PropTypes.string,
    platform: PropTypes.any,
    refreshNotifications: PropTypes.func,
    removeNotificationByKey: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    residence: PropTypes.string,
    setNotificationCount: PropTypes.func,
    setCurrentFocus: PropTypes.func,
};

export default connect(({ client, common, modules, notifications, ui }) => ({
    addNotificationMessage: notifications.addNotificationMessage,
    balance: client.balance,
    currency: client.currency,
    filterNotificationMessages: notifications.filterNotificationMessages,
    local_currency_config: client.local_currency_config,
    loginid: client.loginid,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_logging_in: client.is_logging_in,
    is_virtual: client.is_virtual,
    Notifications: ui.notification_messages_ui,
    platform: common.platform,
    refreshNotifications: notifications.refreshNotifications,
    removeNotificationByKey: notifications.removeNotificationByKey,
    removeNotificationMessage: notifications.removeNotificationMessage,
    residence: client.residence,
    setNotificationCount: modules.cashier.general_store.setNotificationCount,
    setOnRemount: modules.cashier.general_store.setOnRemount,
    is_mobile: ui.is_mobile,
    setCurrentFocus: ui.setCurrentFocus,
    current_focus: ui.current_focus,
}))(withRouter(P2PCashier));
