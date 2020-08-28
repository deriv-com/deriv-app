import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { getPropertyValue, isProduction } from '@deriv/shared';
import { Tabs, Modal } from '@deriv/components';
import { Dp2pProvider } from 'Components/context/dp2p-context';
import ServerTime from 'Utils/server-time';
import { init as WebsocketInit, getModifiedP2POrderList, requestWS, subscribeWS, waitWS } from 'Utils/websocket';
import { localize, setLanguage } from './i18next';
import OrderInfo, { orderToggleIndex } from './orders/order-info';
import BuySell from './buy-sell/buy-sell.jsx';
import MyAds from './my-ads/my-ads.jsx';
import Orders from './orders/orders.jsx';
import NicknameForm from './nickname/nickname-form.jsx';
import Download from './verification/download.jsx';
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

        this.ws_subscriptions = {};
        this.list_item_limit = 20;
        this.is_active_tab = true;
        this.state = {
            active_index: 0,
            loginid: this.props.client.loginid,
            order_offset: 0,
            orders: [],
            notification_count: 0,
            active_notification_count: 0,
            inactive_notification_count: 0,
            parameters: null,
            is_advertiser: false,
            is_restricted: false,
            show_popup: false,
            order_table_type: orderToggleIndex.ACTIVE,
            chat_info: {
                app_id: '',
                user_id: '',
                token: '',
            },
        };
    }

    componentDidMount() {
        this.is_mounted = true;

        // force safari refresh on back/forward
        window.onpageshow = function(event) {
            if (event.persisted) {
                window.location.reload(true);
            }
        };

        waitWS('authorize').then(() => {
            this.ws_subscriptions = {
                advertiser_subscription: subscribeWS(
                    {
                        p2p_advertiser_info: 1,
                        subscribe: 1,
                    },
                    [this.setIsAdvertiser, this.setChatInfoUsingAdvertiserInfo]
                ),
                order_list_subscription: subscribeWS(
                    {
                        p2p_order_list: 1,
                        subscribe: 1,
                        offset: 0,
                        limit: this.list_item_limit,
                    },
                    [this.setP2pOrderList]
                ),
            };
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.order_id !== this.props.order_id && this.props.order_id) {
            this.redirectTo('orders');
        }
    }

    componentWillUnmount() {
        this.is_mounted = false;
        Object.keys(this.ws_subscriptions).forEach(key => this.ws_subscriptions[key].unsubscribe());
    }

    redirectTo = (path_name, params = null) => {
        this.setState({ active_index: path[path_name], parameters: params });
    };

    toggleNicknamePopup = () => {
        this.setState({ show_popup: !this.state.show_popup });
        this.resetNicknameErrorState();
    };

    onNicknamePopupClose = () => {
        this.setState({ show_popup: false });
    };

    handleTabClick = idx => {
        this.setState({ active_index: idx, parameters: null });
    };

    createAdvertiser = name => {
        return new Promise(resolve => {
            requestWS({ p2p_advertiser_create: 1, name }).then(response => {
                const { p2p_advertiser_create } = response;
                if (response) {
                    if (response.error) {
                        this.setState({ nickname_error: response.error.message });
                    } else {
                        this.setState({
                            advertiser_id: p2p_advertiser_create.id,
                            is_advertiser: !!p2p_advertiser_create.is_approved,
                            nickname: p2p_advertiser_create.name,
                            nickname_error: undefined,
                        });
                        this.setChatInfo(p2p_advertiser_create.chat_user_id, p2p_advertiser_create.chat_token);
                        this.toggleNicknamePopup();
                    }
                    resolve();
                }
            });
        });
    };

    resetNicknameErrorState = () => {
        this.setState({ nickname_error: undefined });
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
        } else {
            this.ws_subscriptions.advertiser_subscription.unsubscribe();

            if (response.error.code === 'RestrictedCountry') {
                this.setState({ is_restricted: true });
            } else if (response.error.code === 'AdvertiserNotFound') {
                this.setState({ is_advertiser: false });
            }
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
            this.ws_subscriptions.advertiser_subscription.unsubscribe();
            return;
        }

        const user_id = getPropertyValue(p2p_advertiser_info, ['chat_user_id']);
        const token = getPropertyValue(p2p_advertiser_info, ['chat_token']);

        this.setChatInfo(user_id, token);
    };

    setChatInfo = (user_id, token) => {
        const chat_info = {
            app_id: isProduction() ? '1465991C-5D64-4C88-8BD9-B0D7A6455E69' : '4E259BA5-C383-4624-89A6-8365E06D9D39',
            user_id,
            token,
        };

        if (!chat_info.token) {
            requestWS({ service_token: 1, service: 'sendbird' }).then(response => {
                chat_info.token = response.service_token.sendbird.token;
            });
        }

        this.setState({ chat_info });
    };

    getLocalStorageSettings = () => JSON.parse(localStorage.getItem('p2p_settings') || '{}');

    getLocalStorageSettingsForLoginId = () =>
        this.getLocalStorageSettings()[this.state.loginid] || { is_cached: false, notifications: [] };

    handleNotifications = (old_orders, new_orders) => {
        const { is_cached, notifications } = this.getLocalStorageSettingsForLoginId();

        new_orders.forEach(new_order => {
            const order_info = new OrderInfo(new_order);
            const notification = notifications.find(n => n.order_id === new_order.id);
            const old_order = old_orders.find(o => o.id === new_order.id);
            const is_current_order = new_order.id === this.props.order_id;
            const notification_obj = {
                order_id: new_order.id,
                is_seen: is_current_order,
                is_active: order_info.is_active,
            };

            if (old_order) {
                if (old_order.status !== new_order.status) {
                    if (notification) {
                        // If order status changed, notify the user.
                        notification.is_seen = is_current_order;
                        notification.is_active = order_info.is_active;
                    } else {
                        // If we have an old_order, but for some reason don't have a copy in local storage.
                        notifications.push(notification_obj);
                    }
                }
            } else if (!notification) {
                // If we don't have an old order nor a notification, this is a first page load. Compare with
                // cached list or only notify user of actionable orders.
                if (is_cached) {
                    // If we can compare with a cached list, assume each new order should be notified.
                    notifications.push(notification_obj);
                } else {
                    // If we don't have a cached list, only notify user of orders that require action.
                    // This is done so user isn't spammed with old orders after resetting their local storage.
                    const actionable_statuses = ['pending', 'buyer-confirmed'];
                    const is_action_required = actionable_statuses.includes(new_order.status);
                    notifications.push({
                        ...notification_obj,
                        is_seen: is_current_order || !is_action_required,
                    });
                }
            }
        });

        this.updateP2pNotifications(notifications);
    };

    updateP2pNotifications = notifications => {
        const unseen_notifications = notifications.filter(notification => notification.is_seen === false);
        const notification_count = unseen_notifications.length;
        const active_notification_count = unseen_notifications.filter(notification => notification.is_active).length;
        const inactive_notification_count = notification_count - active_notification_count;
        const user_settings = this.getLocalStorageSettingsForLoginId();
        user_settings.is_cached = true;
        user_settings.notifications = notifications;

        const p2p_settings = this.getLocalStorageSettings();
        p2p_settings[this.state.loginid] = user_settings;

        localStorage.setItem('p2p_settings', JSON.stringify(p2p_settings));
        this.setState({ notification_count, active_notification_count, inactive_notification_count });

        if (typeof this.props.setNotificationCount === 'function') {
            this.props.setNotificationCount(notification_count);
        }
    };

    setP2pOrderList = order_response => {
        if (order_response.error) {
            this.ws_subscriptions.order_list_subscription.unsubscribe();
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

    changeOrderToggle = value => {
        this.is_active_tab = value === 'active';
        this.setState({ order_table_type: value });
    };

    render() {
        const {
            active_index,
            order_offset,
            advertiser_id,
            orders,
            parameters,
            notification_count,
            order_table_type,
            chat_info,
            show_popup,
            poi_status,
            is_restricted,
            nickname_error,
            active_notification_count,
            inactive_notification_count,
        } = this.state;
        const {
            className,
            client: { currency, local_currency_config, is_virtual, residence },
            custom_strings,
            order_id,
            setOrderId,
            should_show_verification,
            is_dark_mode_on,
            is_mobile,
            poi_url,
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
                    active_notification_count,
                    inactive_notification_count,
                    currency,
                    local_currency_config,
                    residence,
                    advertiser_id,
                    is_active_tab: this.is_active_tab,
                    is_advertiser: this.state.is_advertiser,
                    is_listed: this.state.is_listed,
                    setIsListed: is_listed => this.setState({ is_listed }),
                    setIsAdvertiser: is_advertiser => this.setState({ is_advertiser }),
                    nickname: this.state.nickname,
                    setNickname: nickname => this.setState({ nickname }),
                    setChatInfo: this.setChatInfo,
                    is_dark_mode_on,
                    is_restricted,
                    email_domain: getPropertyValue(custom_strings, 'email_domain') || 'deriv.com',
                    list_item_limit: this.list_item_limit,
                    order_offset,
                    orders,
                    order_id,
                    setOrderId,
                    poi_status,
                    nickname_error,
                    changeTab: this.handleTabClick,
                    setOrders: incoming_orders => this.setState({ orders: incoming_orders }),
                    setOrderOffset: incoming_order_offset => this.setState({ order_offset: incoming_order_offset }),
                    toggleNicknamePopup: () => this.toggleNicknamePopup(),
                    updateP2pNotifications: this.updateP2pNotifications.bind(this),
                    getLocalStorageSettingsForLoginId: this.getLocalStorageSettingsForLoginId.bind(this),
                    order_table_type,
                    changeOrderToggle: this.changeOrderToggle,
                    createAdvertiser: this.createAdvertiser.bind(this),
                    resetNicknameErrorState: this.resetNicknameErrorState,
                    is_mobile,
                    poi_url,
                }}
            >
                <main className={classNames('p2p-cashier', className)}>
                    {show_popup ? (
                        <>
                            {is_mobile ? (
                                <div className='p2p-nickname__dialog'>
                                    <NicknameForm
                                        handleClose={this.onNicknamePopupClose}
                                        handleConfirm={this.toggleNicknamePopup}
                                        is_mobile
                                    />
                                </div>
                            ) : (
                                <Modal is_open={show_popup} className='p2p-nickname__dialog'>
                                    <NicknameForm
                                        handleClose={this.onNicknamePopupClose}
                                        handleConfirm={this.toggleNicknamePopup}
                                    />
                                </Modal>
                            )}
                        </>
                    ) : (
                        <>
                            {should_show_verification && !this.state.is_advertiser && (
                                <div
                                    className={classNames('p2p-cashier__verification', {
                                        'p2p-cashier__verification--mobile': is_mobile,
                                    })}
                                >
                                    <Verification />
                                </div>
                            )}
                            {should_show_verification && this.state.is_advertiser && <Download />}
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
                        </>
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
            decimal_places: PropTypes.number,
        }).isRequired,
        loginid: PropTypes.string.isRequired,
        residence: PropTypes.string.isRequired,
    }),
    lang: PropTypes.string,
    order_id: PropTypes.string,
    setNotificationCount: PropTypes.func,
    websocket_api: PropTypes.object.isRequired,
};

export default App;
