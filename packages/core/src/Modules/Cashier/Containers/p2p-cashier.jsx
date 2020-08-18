import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { P2pStorage } from '@deriv/p2p/lib/utils';
import P2P from '@deriv/p2p';
import { getLanguage } from '@deriv/translations';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import ServerTime from '_common/base/server_time';
import { routes } from '@deriv/shared';

const P2PCashier = ({ currency, history, is_virtual, local_currency_config, location, residence }) => {
    const [order_id, setOrderId] = React.useState(null);

    React.useEffect(() => {
        const url_params = new URLSearchParams(location.search);
        if (url_params.has('order')) {
            setQueryOrder(url_params.get('order'));
        }
    }, []);

    const setQueryOrder = input_order_id => {
        const pathname = '/cashier/p2p';
        if (input_order_id === null) {
            history.replace({
                pathname,
                hash: location.hash,
            });
        } else {
            const url_params = new URLSearchParams(location.search);
            if (order_id !== input_order_id) {
                url_params.set('order', input_order_id);
            }
            history.replace({
                pathname,
                search: `?${url_params.toString()}`,
                hash: location.hash,
            });
        }

        setOrderId(input_order_id);
    };

    return (
        <P2P
            LocalStorage={P2pStorage}
            client={{ currency, local_currency_config, is_virtual, residence }}
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
    is_virtual: PropTypes.bool,
    local_currency_config: PropTypes.object,
    residence: PropTypes.string,
};

export default withRouter(
    connect(({ client, ui }) => ({
        currency: client.currency,
        is_virtual: client.is_virtual,
        local_currency_config: client.local_currency_config,
        residence: client.residence,
    }))(P2PCashier)
);
