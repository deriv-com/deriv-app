import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ObjectUtils from '@deriv/shared/utils/object';
import { Tabs } from '@deriv/components';
import { Dp2pProvider } from 'Components/context/dp2p-context';
import { orderToggleIndex } from 'Components/orders/order-info';
import ServerTime from 'Utils/server-time';
import { init, getModifiedP2POrderList, subscribeWS } from 'Utils/websocket';
import { localize, setLanguage } from './i18next';
import BuySell from './buy-sell/buy-sell.jsx';
import MyAds from './my-ads/my-ads.jsx';
// import MyProfile  from './my-profile/my-profile.jsx';
import Orders from './orders/orders.jsx';
import './app.scss';

const allowed_currency = 'USD';

const path = {
    buy_sell: 0,
    orders: 1,
    my_ads: 2,
    // my_profile: 3,
};

class App extends React.Component {
    constructor(props) {
        super(props);

        setLanguage(this.props.lang);
        init(this.props.websocket_api, this.props.client.local_currency_config.decimal_places);
        ServerTime.init(this.props.server_time);

        this.ws_subscriptions = [];
        this.list_item_limit = 20;
        this.state = {
            active_index: 0,
            order_table_type: orderToggleIndex.ACTIVE,
            order_offset: 0,
            orders: [],
            notification_count: 0,
            parameters: null,
            is_advertiser: false,
            is_restricted: false,
        };
    }

    componentDidMount() {
        this.ws_subscriptions.push(
            ...[
                subscribeWS(
                    {
                        p2p_advertiser_info: 1,
                        subscribe: 1,
                    },
                    this.setIsAdvertiser
                ),
                subscribeWS(
                    {
                        p2p_order_list: 1,
                        subscribe: 1,
                        offset: 0,
                        limit: this.list_item_limit,
                    },
                    this.setP2pOrderList
                ),
            ]
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.order_id !== this.props.order_id && this.props.order_id) {
            this.redirectTo('orders');
        }
    }

    componentWillUnmount() {
        this.ws_subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    redirectTo = (path_name, params = null) => {
        this.setState({ active_index: path[path_name], parameters: params });
    };

    handleTabClick = idx => {
        this.setState({ active_index: idx, parameters: null });
    };

    updateOrderToggleIndex = index => {
        this.setState({ order_table_type: index });
    };

    setIsAdvertiser = response => {
        const { p2p_advertiser_info } = response;
        if (!response.error) {
            this.setState({
                advertiser_id: p2p_advertiser_info.id,
                is_advertiser: !!p2p_advertiser_info.is_approved,
            });
        } else if (p2p_advertiser_info.error?.code === 'RestrictedCountry') {
            this.setState({ is_restricted: true });
        }
    };

    handleNotifications = orders => {
        let p2p_notification_count = 0;

        orders.forEach(order => {
            const type = order.is_incoming
                ? ObjectUtils.getPropertyValue(order, ['advert_details', 'type'])
                : order.type;

            // show notifications for:
            // 1. buy orders that are pending buyer payment, or
            // 2. sell orders that are pending seller confirmation
            if (type === 'buy' ? order.status === 'pending' : order.status === 'buyer-confirmed') {
                p2p_notification_count++;
            }
        });
        this.setState({ notification_count: p2p_notification_count });
        this.props.setNotificationCount(p2p_notification_count);
    };

    setP2pOrderList = order_response => {
        // check if there is any error
        if (!order_response.error) {
            const { p2p_order_list } = order_response;

            if (p2p_order_list) {
                const { list } = p2p_order_list;
                // it's an array of orders from p2p_order_list
                this.setState({ order_offset: list.length, orders: getModifiedP2POrderList(list) });
                this.handleNotifications(list);
            } else {
                // it's a single order from p2p_order_info
                const idx_order_to_update = this.state.orders.findIndex(order => order.id === order_response.id);
                const updated_orders = [...this.state.orders];
                // if it's a new order, add it to the top of the list
                if (idx_order_to_update < 0) {
                    updated_orders.unshift(order_response);
                } else {
                    // otherwise, update the correct order
                    updated_orders[idx_order_to_update] = order_response;
                }
                // trigger re-rendering by setting orders again
                this.setState({ order_offset: updated_orders.length, orders: updated_orders });
                this.handleNotifications(updated_orders);
            }
        }
    };

    render() {
        const { active_index, order_offset, orders, parameters, notification_count, order_table_type } = this.state;
        const {
            className,
            client: { currency, local_currency_config, is_virtual, residence },
            custom_strings,
            order_id,
            setOrderId,
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
                    changeTab: this.handleTabClick,
                    order_table_type,
                    changeOrderToggle: this.updateOrderToggleIndex,
                    currency,
                    local_currency_config,
                    residence,
                    advertiser_id: this.state.advertiser_id,
                    is_advertiser: this.state.is_advertiser,
                    is_restricted: this.state.is_restricted,
                    email_domain: ObjectUtils.getPropertyValue(custom_strings, 'email_domain') || 'deriv.com',
                    list_item_limit: this.list_item_limit,
                    order_offset,
                    orders,
                    setOrders: incoming_orders => this.setState({ orders: incoming_orders }),
                    setOrderOffset: incoming_order_offset => this.setState({ order_offset: incoming_order_offset }),
                    order_id,
                    setOrderId,
                }}
            >
                <main className={classNames('p2p-cashier', className)}>
                    <Tabs
                        onTabItemClick={this.handleTabClick}
                        active_index={active_index}
                        className='p2p-cashier'
                        top
                        header_fit_content
                    >
                        <div label={localize('Buy / Sell')}>
                            <BuySell navigate={this.redirectTo} params={parameters} />
                        </div>
                        <div count={notification_count} label={localize('Orders')}>
                            <Orders navigate={this.redirectTo} params={parameters} />
                        </div>
                        <div label={localize('My ads')}>
                            <MyAds navigate={this.redirectTo} params={parameters} />
                        </div>
                        {/* TODO [p2p-uncomment] uncomment this when profile is ready */}
                        {/* <div label={localize('My profile')}>
                            <MyProfile navigate={this.redirectTo} params={parameters} />
                        </div> */}
                    </Tabs>
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
    order_id: PropTypes.string,
    setNotificationCount: PropTypes.func,
    websocket_api: PropTypes.object.isRequired,
};

export default App;
