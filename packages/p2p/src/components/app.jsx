import classNames from 'classnames';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { routes } from '@deriv/shared';
import { StoreProvider, useStore } from '@deriv/stores';
import ServerTime from 'Utils/server-time';
import { waitWS } from 'Utils/websocket';
import AppContent from './app-content.jsx';
import { setLanguage } from './i18next';
import './app.scss';
import Routes from '../routes/routes.jsx';

const App = ({ passthrough: { root_store }, ...props }) => {
    const {
        modules: { p2p_store },
    } = useStore();
    const { general_store, order_store } = p2p_store;

    const {
        balance,
        className,
        error,
        has_error,
        history,
        is_logged_in,
        is_logging_in,
        lang,
        Notifications,
        order_id,
        server_time,
        verification_action,
        verification_code,
        websocket_api,
        setOnRemount,
    } = props;

    React.useEffect(() => {
        general_store.setAppProps(props);
        general_store.setWebsocketInit(websocket_api);
        general_store.getWebsiteStatus();

        // Redirect back to /p2p, this was implemented for the mobile team. Do not remove.
        if (/\/verification$/.test(history?.location.pathname)) {
            localStorage.setItem('is_verifying_p2p', true);
            history.push(routes.cashier_p2p);
        }

        ServerTime.init(server_time);

        // force safari refresh on back/forward
        window.onpageshow = function (event) {
            if (event.persisted) {
                window.location.reload();
            }
        };
        waitWS('authorize').then(() => {
            general_store.onMount();
            setOnRemount(general_store.onMount);
            if (localStorage.getItem('is_verifying_p2p')) {
                localStorage.removeItem('is_verifying_p2p');
                general_store.setActiveIndex(general_store.path.my_ads);
            }
        });

        return () => general_store.onUnmount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setLanguage(lang);
    }, [lang]);

    React.useEffect(() => {
        if (order_id) {
            general_store.redirectTo('orders');
            order_store.setOrderId(order_id);
        }
        general_store.props.setP2POrderProps({
            order_id,
            redirectToOrderDetails: general_store.redirectToOrderDetails,
            setIsRatingModalOpen: order_store.setIsRatingModalOpen,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    React.useEffect(() => {
        general_store.setAccountBalance(balance);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [balance]);

    React.useEffect(() => {
        setLanguage(lang);
    }, [lang]);

    React.useEffect(() => {
        if (verification_code) {
            // We need an extra state since we delete the code from the query params.
            // Do not remove.
            order_store.setVerificationCode(verification_code);
        }
        if (verification_action && verification_code) {
            order_store.setIsLoadingModalOpen(true);
            order_store.verifyEmailVerificationCode(verification_action, verification_code);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [verification_action, verification_code]);

    return (
        <StoreProvider root_store={root_store}>
            <Routes error={error} has_error={has_error} is_logged_in={is_logged_in} is_logging_in={is_logging_in} />
            <main className={classNames('p2p-cashier', className)}>
                <Notifications />
                <AppContent />
            </main>
        </StoreProvider>
    );
};

App.propTypes = {
    balance: PropTypes.string,
    className: PropTypes.string,
    error: PropTypes.object,
    has_error: PropTypes.bool,
    history: PropTypes.object,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    lang: PropTypes.string,
    modal_root_id: PropTypes.string.isRequired,
    order_id: PropTypes.string,
    passthrough: PropTypes.object,
    server_time: PropTypes.object,
    setNotificationCount: PropTypes.func,
    setOnRemount: PropTypes.func,
    verification_action: PropTypes.string,
    verification_code: PropTypes.string,
    websocket_api: PropTypes.object.isRequired,
};

export default observer(App);
