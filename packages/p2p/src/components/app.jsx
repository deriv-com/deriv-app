import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from '@deriv/components';
import ObjectUtils from '@deriv/shared/utils/object';
import { Dp2pProvider } from 'Components/context/dp2p-context';
import ServerTime from 'Utils/server-time';
import { init, requestWS, subscribeWS } from 'Utils/websocket';
import { localize, setLanguage } from './i18next';
import BuySell from './buy-sell/buy-sell.jsx';
import MyAds from './my-ads/my-ads.jsx';
// import MyProfile  from './my-profile/my-profile.jsx';
import Orders from './orders/orders.jsx';
import OrderInfo from './orders/order-info';
import './app.scss';

const allowed_currency = 'USD';

const path = {
    buy_sell: 0,
    orders: 1,
    my_ads: 2,
    // my_profile: 3,
};

const notifications_map = {
    pending: {
        is_agent_buyer: 0,
        is_agent_seller: 1,
        is_client_buyer: 1,
        is_client_seller: 0,
    },
    'buyer-confirmed': {
        is_agent_buyer: 1,
        is_agent_seller: 0,
        is_client_buyer: 0,
        is_client_seller: 1,
    },
};

class App extends Component {
    constructor(props) {
        super(props);

        setLanguage(this.props.lang);
        init(this.props.websocket_api, this.props.client.local_currency_config.decimal_places);
        ServerTime.init(this.props.server_time);

        this.state = {
            active_index: 0,
            orders: [],
            parameters: null,
            is_agent: false,
            notifications: 0,
        };
    }

    redirectTo = (path_name, params = null) => {
        this.setState({ active_index: path[path_name], parameters: params });
    };

    handleTabClick = () => {
        this.setState({ parameters: null });
    };

    setIsAgent = () =>
        new Promise(async resolve => {
            const agent_info = await requestWS({ p2p_agent_info: 1 });

            /* if there is no error means its an agent else its a client */
            if (!agent_info.error) {
                await this.setState({ agent_id: agent_info.p2p_agent_info.agent_id, is_agent: true });
            }
            resolve();
        });

    handleNotifications = updated_orders => {
        let notifications = 0;

        updated_orders.forEach(order => {
            const modified_order = new OrderInfo(order);

            const user_state = {
                is_agent_buyer: this.state.is_agent && modified_order.is_buyer,
                is_agent_seller: this.state.is_agent && !modified_order.is_buyer,
                is_client_buyer: !this.state.is_agent && modified_order.is_buyer,
                is_client_seller: !this.state.is_agent && !modified_order.is_buyer,
            };

            const order_state = {
                pending: modified_order.is_pending,
                'buyer-confirmed': modified_order.is_buyer_confirmed,
            };

            Object.keys(notifications_map).forEach(notif_state => {
                if (order_state[notif_state]) {
                    Object.keys(notifications_map[notif_state]).forEach(notif_condition => {
                        notifications += user_state[notif_condition] && notifications_map[notif_state][notif_condition];
                    });
                }
            });
        });

        this.setState({ notifications });
        this.props.setP2pNotifications(notifications);
    };

    // API will send p2p_order_list first as a list of all orders
    // then each subscription response for a single updated order will come as p2p_order_info
    handleOrderListResponse = order_response => {
        if (Array.isArray(order_response)) {
            // it's an array of orders from p2p_order_list
            this.setState({ orders: order_response });
            this.handleNotifications(order_response);
        } else {
            // it's a single order from p2p_order_info
            const idx_order_to_update = this.state.orders.findIndex(
                order => order.order_id === order_response.order_id
            );
            const updated_orders = [...this.state.orders];
            // if it's a new order, add it to the top of the list
            if (idx_order_to_update < 0) {
                updated_orders.unshift(order_response);
            } else {
                // otherwise, update the correct order
                updated_orders[idx_order_to_update] = order_response;
            }
            // trigger re-rendering by setting orders again
            this.setState({ orders: updated_orders }, () => this.handleNotifications(updated_orders));
        }
    };

    initializeApp = async () => {
        await this.setIsAgent();
        subscribeWS({ p2p_order_list: 1, subscribe: 1 }, this.handleOrderListResponse);
    };

    componentDidMount() {
        this.initializeApp();
    }

    componentWillUnmount = () => {
        requestWS({ forget_all: 'p2p_order' });
    };

    render() {
        const { active_index, orders, parameters } = this.state;
        const {
            className,
            client: { currency, local_currency_config, is_virtual, residence },
        } = this.props;

        // TODO: remove allowed_currency check once we publish this to everyone
        if (is_virtual || currency !== allowed_currency) {
            return (
                <h1 className='p2p-not-allowed'>
                    {localize('This feature is only available for real-money USD accounts right now.')}
                </h1>
            );
        }

        return (
            <Dp2pProvider
                value={{
                    currency,
                    local_currency_config,
                    residence,
                    agent_id: this.state.agent_id,
                    is_agent: this.state.is_agent,
                    email_domain:
                        ObjectUtils.getPropertyValue(this.props.custom_strings, 'email_domain') || 'deriv.com',
                }}
            >
                <main className={classNames('deriv-p2p', className)}>
                    {this.state.is_agent ? (
                        <Tabs onTabItemClick={this.handleTabClick} active_index={active_index} top>
                            <div label={localize('Buy/Sell')}>
                                <BuySell navigate={this.redirectTo} params={parameters} />
                            </div>
                            <div count={this.state.notifications} label={localize('Incoming orders')}>
                                <Orders navigate={this.redirectTo} orders={orders} params={parameters} />
                            </div>
                            <div label={localize('My ads')}>
                                <MyAds navigate={this.redirectTo} params={parameters} />
                            </div>
                            {/* TODO [p2p-uncomment] uncomment this when profile is ready */}
                            {/* <div label={localize('My profile')}>
                                <MyProfile navigate={this.redirectTo} params={parameters} />
                            </div> */}
                        </Tabs>
                    ) : (
                        <Tabs onTabItemClick={this.handleTabClick} active_index={active_index} top>
                            <div label={localize('Buy/Sell')}>
                                <BuySell navigate={this.redirectTo} params={parameters} />
                            </div>
                            {/* TODO: [p2p-replace-with-api] Add 'count' prop to this div for notification counter */}
                            <div count={this.state.notifications} label={localize('My Orders')}>
                                <Orders navigate={this.redirectTo} orders={orders} params={parameters} />
                            </div>
                            {/* TODO [p2p-uncomment] uncomment this when profile is ready */}
                            {/* <div label={localize('My profile')}>
                                <MyProfile navigate={this.redirectTo} params={parameters} />
                            </div> */}
                        </Tabs>
                    )}
                </main>
            </Dp2pProvider>
        );
    }
}

App.propTypes = {
    client: PropTypes.shape({
        currency: PropTypes.string.isRequired,
        custom_strings: PropTypes.shape({
            email_domain: PropTypes.string,
        }),
        is_virtual: PropTypes.bool.isRequired,
        local_currency_config: PropTypes.shape({
            currency: PropTypes.string.isRequired,
            decimal_places: PropTypes.number.isRequired,
        }).isRequired,
        residence: PropTypes.string.isRequired,
    }),
    lang: PropTypes.string,
    websocket_api: PropTypes.object.isRequired,
};

export default App;
