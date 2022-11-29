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
    setIsUserOnP2p,
    setP2POrderProps,
    setNotificationCount,
    setCurrentFocus,
    balance,
    setOnRemount,
}) => {
    const [order_id, setOrderId] = React.useState(null);
    const [action_param, setActionParam] = React.useState();
    const [code_param, setCodeParam] = React.useState();

    const server_time = {
        get,
        init,
        timePromise,
    };

    React.useEffect(() => {
        const url_params = new URLSearchParams(location.search);
        let passed_order_id;

        setActionParam(url_params.get('action'));
        if (is_mobile) {
            setCodeParam(localStorage.getItem('verification_code.p2p_order_confirm'));
        } else if (!code_param) {
            if (url_params.has('code')) {
                setCodeParam(url_params.get('code'));
            } else if (localStorage.getItem('verification_code.p2p_order_confirm')) {
                setCodeParam(localStorage.getItem('verification_code.p2p_order_confirm'));
            }
        }

        // Different emails give us different params (order / order_id),
        // don't remove order_id since it's consistent for mobile and web for 2FA
        if (url_params.has('order_id')) {
            passed_order_id = url_params.get('order_id');
        } else if (url_params.has('order')) {
            passed_order_id = url_params.get('order');
        }

        if (passed_order_id) {
            setQueryOrder(passed_order_id);
        }

        return () => setQueryOrder(null);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setQueryOrder]);

    const setQueryOrder = React.useCallback(
        input_order_id => {
            const current_query_params = new URLSearchParams(location.search);

            if (is_mobile) {
                current_query_params.delete('action');
                current_query_params.delete('code');
            }

            if (current_query_params.has('order_id') || current_query_params.has('order')) {
                current_query_params.delete('order');
                current_query_params.delete('order_id');
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [history, location.hash, location.search]
    );

    if (is_logging_in) {
        return <Loading is_fullscreen />;
    }

    return (
        <P2P
            addNotificationMessage={addNotificationMessage}
            balance={balance}
            client={{ currency, local_currency_config, is_virtual, residence, loginid }}
            current_focus={current_focus}
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
            setCurrentFocus={setCurrentFocus}
            setNotificationCount={setNotificationCount}
            setOrderId={setQueryOrder}
            setOnRemount={setOnRemount}
            setP2POrderProps={setP2POrderProps}
            setIsUserOnP2p={setIsUserOnP2p}
            should_show_verification={/verification/.test(location.hash)}
            verification_action={action_param}
            verification_code={code_param}
            websocket_api={WS}
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
    setP2POrderProps: PropTypes.func,
    setIsUserOnP2p: PropTypes.func,
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
    setP2POrderProps: notifications.setP2POrderProps,
    setIsUserOnP2p: modules.cashier.general_store.setIsUserOnP2p,
    is_mobile: ui.is_mobile,
    setCurrentFocus: ui.setCurrentFocus,
    current_focus: ui.current_focus,
}))(withRouter(P2PCashier));
