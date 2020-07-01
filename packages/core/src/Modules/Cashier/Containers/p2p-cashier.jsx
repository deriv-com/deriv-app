import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import P2P from '@deriv/p2p';
import { P2pStorage } from '@deriv/p2p/lib/utils';
import { getLanguage } from '@deriv/translations';
import routes from '@deriv/shared/utils/routes';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import ServerTime from '_common/base/server_time';

const P2PCashier = ({
    currency,
    history,
    is_mobile,
    is_virtual,
    local_currency_config,
    location,
    loginid,
    residence,
}) => {
    const [order_id, setOrderId] = React.useState(null);

    React.useEffect(() => {
        const url_params = new URLSearchParams(location.search);
        if (url_params.has('order')) {
            setOrderId(url_params.get('order'));
            setQueryOrder(order_id);
        }
    }, []);

    const setQueryOrder = input_order_id => {
        const current_query_param = queryString.parse(location.search);
        delete current_query_param.order;

        const order_id_param = input_order_id
            ? { ...current_query_param, order: input_order_id }
            : { ...current_query_param };

        if (order_id !== input_order_id) {
            // Changing query params
            history.push({
                pathname: '/cashier/p2p',
                search: queryString.stringify(order_id_param),
                hash: location.hash,
            });

            setOrderId(input_order_id);
        }
    };

    return (
        <P2P
            LocalStorage={P2pStorage}
            client={{ currency, local_currency_config, is_virtual, residence, loginid }}
            is_mobile={is_mobile}
            lang={getLanguage()}
            order_id={order_id}
            poi_url={routes.proof_of_identity}
            server_time={ServerTime}
            setOrderId={setQueryOrder}
            should_show_verification={/verification/.test(location.hash)}
            websocket_api={WS}
        />
    );
};

P2PCashier.propTypes = {
    currency: PropTypes.string,
    is_mobile: PropTypes.bool,
    is_virtual: PropTypes.bool,
    local_currency_config: PropTypes.object,
    loginid: PropTypes.string,
    residence: PropTypes.string,
};

export default withRouter(
    connect(({ client, ui }) => ({
        currency: client.currency,
        is_mobile: ui.is_mobile,
        is_virtual: client.is_virtual,
        local_currency_config: client.local_currency_config,
        loginid: client.loginid,
        residence: client.residence,
    }))(P2PCashier)
);
