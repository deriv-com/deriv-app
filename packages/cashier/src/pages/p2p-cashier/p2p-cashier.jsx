import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getLanguage } from '@deriv/translations';
import { routes, WS } from '@deriv/shared';
import { Loading } from '@deriv/components';
import P2P from '@deriv/p2p';
import { get, init, timePromise } from 'Utils/server_time';
import { observer, useStore } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';

/* P2P will use the same websocket connection as Deriv/Binary, we need to pass it as a prop */
const P2PCashier = observer(({ history, location }) => {
    const { notifications, client, ui, common } = useStore();
    const {
        addNotificationMessage,
        filterNotificationMessages,
        refreshNotifications,
        removeNotificationByKey,
        removeNotificationMessage,
        setP2POrderProps,
    } = notifications;
    const { balance, currency, local_currency_config, loginid, is_logging_in, is_virtual, residence } = client;
    const { notification_messages_ui: Notifications, is_dark_mode_on, is_mobile, setCurrentFocus, current_focus } = ui;
    const { platform } = common;
    const { general_store } = useCashierStore();
    const { setNotificationCount, setOnRemount } = general_store;
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
            should_show_verification={/verification/.test(location.hash)}
            verification_action={action_param}
            verification_code={code_param}
            websocket_api={WS}
        />
    );
});

P2PCashier.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};

export default withRouter(P2PCashier);
