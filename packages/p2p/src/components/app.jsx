import classNames from 'classnames';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { routes } from '@deriv/shared';
import ServerTime from 'Utils/server-time';
import { waitWS } from 'Utils/websocket';
import { useStores } from 'Stores';
import AppContent from './app-content.jsx';
import { setLanguage } from './i18next';
import './app.scss';

const App = props => {
    const { general_store, order_store } = useStores();
    const { className, history, lang, order_id, server_time, websocket_api } = props;

    React.useEffect(() => {
        general_store.setAppProps(props);
        general_store.setWebsocketInit(websocket_api, general_store.client.local_currency_config.decimal_places);

        order_store.setOrderId(order_id);

        // Redirect back to /p2p, this was implemented for the mobile team. Do not remove.
        if (/\/verification$/.test(history?.location.pathname)) {
            localStorage.setItem('is_verifying_p2p', true);
            history.push(routes.cashier_p2p);
        }

        setLanguage(lang);
        ServerTime.init(server_time);

        // force safari refresh on back/forward
        window.onpageshow = function (event) {
            if (event.persisted) {
                window.location.reload();
            }
        };

        waitWS('authorize').then(() => {
            general_store.onMount();

            if (localStorage.getItem('is_verifying_p2p')) {
                localStorage.removeItem('is_verifying_p2p');
                general_store.setActiveIndex(general_store.path.my_ads);
            }
        });

        return () => general_store.onUnmount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (order_id) {
            general_store.redirectTo('orders');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    return (
        <main className={classNames('p2p-cashier', className)}>
            <AppContent />
        </main>
    );
};

App.propTypes = {
    client: PropTypes.shape({
        currency: PropTypes.string.isRequired,
        is_virtual: PropTypes.bool.isRequired,
        local_currency_config: PropTypes.shape({
            currency: PropTypes.string.isRequired,
            decimal_places: PropTypes.number,
        }).isRequired,
        loginid: PropTypes.string.isRequired,
        residence: PropTypes.string.isRequired,
    }),
    lang: PropTypes.string,
    modal_root_id: PropTypes.string.isRequired,
    order_id: PropTypes.string,
    setNotificationCount: PropTypes.func,
    websocket_api: PropTypes.object.isRequired,
};

export default observer(App);
