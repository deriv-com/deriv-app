import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ObjectUtils from '@deriv/shared/utils/object';
import { Tabs, Dialog } from '@deriv/components';
import { Dp2pProvider } from 'Components/context/dp2p-context';
import ServerTime from 'Utils/server-time';
import { init as WebsocketInit, getModifiedP2POrderList, requestWS, subscribeWS } from 'Utils/websocket';
import { localize, setLanguage } from './i18next';
import BuySell from './buy-sell/buy-sell.jsx';
import MyAds from './my-ads/my-ads.jsx';
import Orders from './orders/orders.jsx';
import NicknameForm from './nickname/nickname-form.jsx';
import Verification from './verification/verification.jsx';
import './app.scss';

const allowed_currency = 'USD';

const path = {
    buy_sell: 0,
    orders: 1,
    my_ads: 2,
    // my_profile: 3,
};

class App extends React.Component {
    is_mounted = false;

    constructor(props) {
        super(props);

        setLanguage(this.props.lang);
        WebsocketInit(this.props.websocket_api, this.props.client.local_currency_config.decimal_places);
        ServerTime.init(this.props.server_time);

        this.ws_subscriptions = [];
        this.list_item_limit = 20;
        this.state = {
            active_index: 0,
            order_offset: 0,
            orders: [],
            notification_count: 0,
            parameters: null,
            is_advertiser: false,
            is_restricted: false,
            show_popup: false,
            chat_info: {
                app_id: '',
                user_id: '',
                token: '',
            },
        };
    }

    componentDidMount() {
        this.is_mounted = true;
        this.ws_subscriptions.push(
            ...[
                subscribeWS(
                    {
                        p2p_advertiser_info: 1,
                        subscribe: 1,
                    },
                    [this.setIsAdvertiser, this.setChatInfoUsingAdvertiserInfo]
                ),
                subscribeWS(
                    {
                        p2p_order_list: 1,
                        subscribe: 1,
                        offset: 0,
                        limit: this.list_item_limit,
                    },
                    [this.setP2pOrderList]
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
        this.is_mounted = false;
        this.ws_subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    redirectTo = (path_name, params = null) => {
        this.setState({ active_index: path[path_name], parameters: params });
    };

    toggleNicknamePopup = () => {
        this.setState({ show_popup: !this.state.show_popup });
    };

    onNicknamePopupClose = () => {
        this.setState({ show_popup: false });
    };

    handleTabClick = idx => {
        this.setState({ active_index: idx, parameters: null });
    };

    setIsAdvertiser = response => {
        const { p2p_advertiser_info } = response;
        if (!response.error) {
            this.setState({
                advertiser_id: p2p_advertiser_info.id,
                is_advertiser: !!p2p_advertiser_info.is_approved,
                is_listed: p2p_advertiser_info.is_listed === 1,
                nickname: p2p_advertiser_info.name,
            });
        } else if (response.error.code === 'RestrictedCountry') {
            this.setState({ is_restricted: true });
        } else if (response.error.code === 'AdvertiserNotFound') {
            this.setState({ is_advertiser: false });
        } else {
            this.ws_subscriptions[0].unsubscribe();
        }

        if (!this.state.is_advertiser) {
            requestWS({ get_account_status: 1 }).then(account_response => {
                if (this.is_mounted && !account_response.error) {
                    const { get_account_status } = account_response;
                    const { authentication } = get_account_status;
                    const { identity } = authentication;

                    this.setState({
                        poi_status: identity.status,
                    });
                }
            });
        }
    };

    setChatInfoUsingAdvertiserInfo = response => {
        const { p2p_advertiser_info } = response;
        if (response.error) {
            this.ws_subscriptions[0].unsubscribe();
            return;
        }

        const user_id = ObjectUtils.getPropertyValue(p2p_advertiser_info, ['chat_user_id']);
        const token = ObjectUtils.getPropertyValue(p2p_advertiser_info, ['chat_token']);

        this.setChatInfo(user_id, token);
    };

    setChatInfo = (user_id, token) => {
        const chat_info = {
            // This is using QA10 SendBird AppId, please change to production's SendBird AppId when we deploy to production.
            app_id: '4E259BA5-C383-4624-89A6-8365E06D9D39',
            user_id,
            token,
        };

        if (!chat_info.token) {
            requestWS({ service_token: 1, service: 'sendbird' }).then(response => {
                chat_info.token = response.service_token.token;
            });
        }

        this.setState({ chat_info });
    };

    getLocalStorageSettings = () => {
        return JSON.parse(localStorage.getItem('dp2p_settings') || '{ "is_cached": false, "notifications": [] }');
    };

    handleNotifications = (old_orders, new_orders) => {
        const { is_cached, notifications } = this.getLocalStorageSettings();

        new_orders.forEach(new_order => {
            const old_order = old_orders.find(o => o.id === new_order.id);
            const notification = notifications.find(n => n.order_id === new_order.id);
            const is_current_order = new_order.id === this.props.order_id;

            if (old_order) {
                if (old_order.status !== new_order.status) {
                    if (notification) {
                        // If order status changed, notify the user.
                        notification.is_seen = is_current_order;
                    } else {
                        // If we have an old_order, but for some reason don't have a copy in local storage.
                        notifications.push({ order_id: new_order.id, is_seen: is_current_order });
                    }
                }
            } else if (!notification) {
                // If we don't have an old order nor a notification, this is a first page load. Compare with
                // cached list or only notify user of actionable orders.
                if (is_cached) {
                    // If we can compare with a cached list, assume each new order should be notified.
                    notifications.push({ order_id: new_order.id, is_seen: is_current_order });
                } else {
                    // If we don't have a cached list, only notify user of orders that require action.
                    // This is done so user isn't spammed with old orders after resetting their local storage.
                    const actionable_statuses = ['pending', 'buyer-confirmed'];
                    const is_action_required = actionable_statuses.includes(new_order.status);
                    notifications.push({ order_id: new_order.id, is_seen: is_current_order || !is_action_required });
                }
            }
        });

        this.updateP2pNotifications(notifications);
    };

    updateP2pNotifications = notifications => {
        const notification_count = notifications.filter(notification => notification.is_seen === false).length;
        const dp2p_settings = JSON.stringify({ is_cached: true, notifications });

        localStorage.setItem('dp2p_settings', dp2p_settings);
        this.setState({ notification_count });

        if (typeof this.props.setNotificationCount === 'function') {
            this.props.setNotificationCount(notification_count);
        }
    };

    setP2pOrderList = order_response => {
        if (order_response.error) {
            this.ws_subscriptions[1].unsubscribe();
            return;
        }
        const { p2p_order_list } = order_response;

        if (p2p_order_list) {
            const { list } = p2p_order_list;
            // it's an array of orders from p2p_order_list
            this.handleNotifications(this.state.orders, list);
            this.setState({ order_offset: list.length, orders: getModifiedP2POrderList(list) });
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
            this.handleNotifications(this.state.orders, updated_orders);
            this.setState({ order_offset: updated_orders.length, orders: updated_orders });
        }
    };

    render() {
        const {
            active_index,
            order_offset,
            orders,
            parameters,
            notification_count,
            order_table_type,
            chat_info,
            show_popup,
        } = this.state;
        const {
            className,
            client: { currency, local_currency_config, is_virtual, residence },
            custom_strings,
            order_id,
            setOrderId,
            should_show_verification,
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
                    currency,
                    local_currency_config,
                    residence,
                    advertiser_id: this.state.advertiser_id,
                    is_advertiser: this.state.is_advertiser,
                    is_listed: this.state.is_listed,
                    setIsListed: is_listed => this.setState({ is_listed }),
                    setIsAdvertiser: is_advertiser => this.setState({ is_advertiser }),
                    nickname: this.state.nickname,
                    setNickname: nickname => this.setState({ nickname }),
                    setChatInfo: this.setChatInfo,
                    is_restricted: this.state.is_restricted,
                    email_domain: ObjectUtils.getPropertyValue(custom_strings, 'email_domain') || 'deriv.com',
                    list_item_limit: this.list_item_limit,
                    order_offset,
                    orders,
                    setOrders: incoming_orders => this.setState({ orders: incoming_orders }),
                    setOrderOffset: incoming_order_offset => this.setState({ order_offset: incoming_order_offset }),
                    order_id,
                    setOrderId,
                    toggleNicknamePopup: () => this.toggleNicknamePopup(),
                    updateP2pNotifications: this.updateP2pNotifications.bind(this),
                    getLocalStorageSettings: this.getLocalStorageSettings.bind(this),
                    poi_status: this.state.poi_status,
                }}
            >
                <main className={classNames('p2p-cashier', className)}>
                    {should_show_verification && (
                        <div className='p2p-cashier--verification'>
                            <Verification />
                        </div>
                    )}
                    {!should_show_verification && (
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
                                <Orders navigate={this.redirectTo} params={parameters} chat_info={chat_info} />
                            </div>
                            <div label={localize('My ads')}>
                                <MyAds navigate={this.redirectTo} params={parameters} />
                            </div>
                            {/* TODO [p2p-uncomment] uncomment this when profile is ready */}
                            {/* <div label={localize('My profile')}>
                                    <MyProfile navigate={this.redirectTo} params={parameters} />
                                </div> */}
                        </Tabs>
                    )}
                    {show_popup && (
                        <div className='p2p-nickname__dialog'>
                            <Dialog is_visible={show_popup}>
                                <NicknameForm
                                    handleClose={this.onNicknamePopupClose}
                                    handleConfirm={this.toggleNicknamePopup}
                                />
                            </Dialog>
                        </div>
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
    order_id: PropTypes.string,
    setNotificationCount: PropTypes.func,
    websocket_api: PropTypes.object.isRequired,
};

export default App;
