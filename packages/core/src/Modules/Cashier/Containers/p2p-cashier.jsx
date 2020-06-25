import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import P2P from '@deriv/p2p';
import { getLanguage } from '@deriv/translations';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import ServerTime from '_common/base/server_time';

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
        const { currency, is_virtual, local_currency_config, residence } = this.props;
        const { order_id } = this.state;
        return (
            <P2P
                client={{ currency, local_currency_config, is_virtual, residence }}
                lang={getLanguage()}
                order_id={order_id}
                server_time={ServerTime}
                setOrderId={this.setQueryOrder}
                websocket_api={WS}
            />
        );
    }
}

P2PCashier.propTypes = {
    currency: PropTypes.string,
    is_virtual: PropTypes.bool,
    local_currency_config: PropTypes.object,
    residence: PropTypes.string,
};

export default withRouter(
    connect(({ client }) => ({
        currency: client.currency,
        local_currency_config: client.local_currency_config,
        is_virtual: client.is_virtual,
        residence: client.residence,
    }))(P2PCashier)
);
