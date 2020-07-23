import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import P2P from '@deriv/p2p';
import { getLanguage } from '@deriv/translations';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import ServerTime from '_common/base/server_time';
import { routes } from '@deriv/shared';

/* P2P will use the same websocket connection as Deriv/Binary, we need to pass it as a prop */
class P2PCashier extends React.Component {
    state = {
        order_id: null,
    };

    setQueryOrder = input_order_id => {
        const { history, location } = this.props;
        const current_query_param = queryString.parse(this.props.location.search);
        delete current_query_param.order;

        const order_id_param = input_order_id
            ? { ...current_query_param, order: input_order_id }
            : { ...current_query_param };

        if (this.state.order_id !== input_order_id) {
            // Changing query params
            history.push({
                pathname: '/cashier/p2p',
                search: queryString.stringify(order_id_param),
                hash: location.hash,
            });
            this.setState({ order_id: input_order_id });
        }
    };

    componentDidMount() {
        const url_params = new URLSearchParams(this.props.location.search);
        const order_id = url_params.get('order');

        if (order_id) {
            this.setQueryOrder(order_id);
        }
    }
    render() {
        const {
            currency,
            local_currency_config,
            loginid,
            is_virtual,
            residence,
            setNotificationCount,
            location,
            is_mobile,
        } = this.props;
        const { order_id } = this.state;
        return (
            <P2P
                should_show_verification={/verification/.test(location.hash)}
                websocket_api={WS}
                lang={getLanguage()}
                client={{ currency, local_currency_config, is_virtual, residence, loginid }}
                server_time={ServerTime}
                setNotificationCount={setNotificationCount}
                order_id={order_id}
                setOrderId={this.setQueryOrder}
                is_mobile={is_mobile}
                poi_url={routes.proof_of_identity}
            />
        );
    }
}

P2PCashier.propTypes = {
    currency: PropTypes.string,
    local_currency_config: PropTypes.object,
    loginid: PropTypes.string,
    is_virtual: PropTypes.bool,
    residence: PropTypes.string,
    setNotificationCount: PropTypes.func,
    is_mobile: PropTypes.bool,
};

export default withRouter(
    connect(({ client, modules, ui }) => ({
        currency: client.currency,
        local_currency_config: client.local_currency_config,
        loginid: client.loginid,
        is_virtual: client.is_virtual,
        residence: client.residence,
        setNotificationCount: modules.cashier.setNotificationCount,
        is_mobile: ui.is_mobile,
    }))(P2PCashier)
);
