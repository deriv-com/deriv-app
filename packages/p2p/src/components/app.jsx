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
import { useStores } from '../../stores';
import './app.scss';

const allowed_currency = 'USD';

const path = {
    buy_sell: 0,
    orders: 1,
    my_ads: 2,
    // my_profile: 3,
};

const App = ({
    className,
    client: { currency, local_currency_config, is_virtual, residence },
    custom_strings,
    is_mobile,
    lang,
    order_id,
    poi_url,
    server_time,
    setNotificationCount,
    setOrderId,
    should_show_verification,
    websocket_api,
}) => {
    // const [active_index, setActiveIndex] = React.useState(0);
    // const [active_notification_count, setActiveNotificationCount] = React.useState(0);
    const [advertiser_id, setAdvertiserId] = React.useState(null);
    const [chat_info, setChatInfoState] = React.useState({
        app_id: '',
        user_id: '',
        token: '',
    });
    const { general_store } = useStores();
    // const [inactive_notification_count, setInactiveNotificationCount] = React.useState(0);
    // const [is_listed, setIsListed] = React.useState(false);
    const is_mounted = React.useRef(false);
    const list_item_limit = 20;
    const [loginid, setLoginId] = React.useState(client.loginid);
    const [nickname, setNickname] = React.useState(null);
    // const [nickname_error, setNicknameError] = React.useState(null);
    // const [notification_count, setNotificationCount] = React.useState(0);
    // const [order_offset, setOrderOffset] = React.useState(0);
    const [order_table_type, setOrderTableType] = React.useState(orderToggleIndex.ACTIVE);
    const [orders, setOrders] = React.useState([]);
    const [parameters, setParameters] = React.useState(null);
    // const [poi_status, setPoiStatus] = React.useState(null);
    // const [show_popup, setShowPopup] = React.useState(false);
    const ws_subscriptions = React.useRef({});

    React.useEffect(() => {
        is_mounted.current = true;

        setLanguage(lang);
        WebsocketInit(websocket_api, client.local_currency_config.decimal_places);
        ServerTime.init(server_time);

        // force safari refresh on back/forward
        window.onpageshow = function(event) {
            if (event.persisted) {
                window.location.reload(true);
            }
        };

        waitWS('authorize').then(() => {
            ws_subscriptions.current = {
                advertiser_subscription: subscribeWS(
                    {
                        p2p_advertiser_info: 1,
                        subscribe: 1,
                    },
                    [updateAdvertiserInfo, setChatInfoUsingAdvertiserInfo]
                ),
                order_list_subscription: subscribeWS(
                    {
                        p2p_order_list: 1,
                        subscribe: 1,
                        offset: 0,
                        limit: list_item_limit,
                    },
                    [setP2pOrderList]
                ),
            };
        });
        return () => {
            is_mounted.current = false;
            Object.keys(ws_subscriptions.current).forEach(key => ws_subscriptions.current[key].unsubscribe());
        };
    }, []);

    React.useEffect(() => {
        if (order_id) {
            redirectTo('orders');
        }
    }, [order_id]);

    const changeOrderToggle = order_table_type => {
        setOrderTableType(order_table_type);
    };

    const createAdvertiser = name => {
        ws_subscriptions.current.advertiser_subscription = subscribeWS(
            { p2p_advertiser_create: 1, name, subscribe: 1 },
            [setCreateAdvertiser]
        );
    };

    const getLocalStorageSettings = () => JSON.parse(localStorage.getItem('p2p_settings') || '{}');

    const getLocalStorageSettingsForLoginId = () =>
        getLocalStorageSettings()[loginid] || { is_cached: false, notifications: [] };

    const handleNotifications = (old_orders, new_orders) => {
        const { is_cached, notifications } = getLocalStorageSettingsForLoginId();

        new_orders.forEach(new_order => {
            const order_info = new OrderInfo(new_order);
            const notification = notifications.find(n => n.order_id === new_order.id);
            const old_order = old_orders.find(o => o.id === new_order.id);
            const is_current_order = new_order.id === order_id;
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

        updateP2pNotifications(notifications);
    };

    const handleTabClick = idx => {
        general_store.setActiveIndex(idx);
        setParameters(null);
    };

    const onNicknamePopupClose = () => {
        general_store.setShowPopup(false);
    };

    const redirectTo = (path_name, params = null) => {
        general_store.setActiveIndex(path[path_name]);
        setParameters(params);
    };

    const setChatInfo = (user_id, token) => {
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
        setChatInfoState(chat_info);
    };

    const setChatInfoUsingAdvertiserInfo = response => {
        const { p2p_advertiser_info } = response;
        if (response.error) {
            ws_subscriptions.current.advertiser_subscription.unsubscribe();
            return;
        }
        const user_id = getPropertyValue(p2p_advertiser_info, ['chat_user_id']);
        const token = getPropertyValue(p2p_advertiser_info, ['chat_token']);

        setChatInfo(user_id, token);
    };

    const setCreateAdvertiser = response => {
        const { p2p_advertiser_create } = response;

        if (response.error) {
            general_store.setNicknameError(response.error.message);
        } else {
            setAdvertiserId(p2p_advertiser_create.id);
            general_store.setIsAdvertiser(!!p2p_advertiser_create.is_approved);
            setNickname(p2p_advertiser_create.name);
            general_store.setNicknameError(undefined);
            setChatInfo(p2p_advertiser_create.chat_user_id, p2p_advertiser_create.chat_token);
            toggleNicknamePopup();
        }
    };

    const setP2pOrderList = order_response => {
        if (order_response.error) {
            ws_subscriptions.current.order_list_subscription.unsubscribe();
            return;
        }
        const { p2p_order_list } = order_response;

        if (p2p_order_list) {
            const { list } = p2p_order_list;
            // it's an array of orders from p2p_order_list
            handleNotifications(orders, list);
            general_store.setOrderOffset(list.length);
            setOrders(getModifiedP2POrderList(list));
        } else {
            // it's a single order from p2p_order_info
            const idx_order_to_update = orders.findIndex(order => order.id === order_response.id);
            const updated_orders = [...orders];
            // if it's a new order, add it to the top of the list
            if (idx_order_to_update < 0) {
                updated_orders.unshift(order_response);
            } else {
                // otherwise, update the correct order
                updated_orders[idx_order_to_update] = order_response;
            }
            // trigger re-rendering by setting orders again
            handleNotifications(orders, updated_orders);
            general_store.setOrderOffset(updated_orders.length);
            setOrders(updated_orders);
        }
    };

    const toggleNicknamePopup = () => {
        general_store.setShowPopup(!general_store.show_popup);
    };

    const updateAdvertiserInfo = response => {
        const { p2p_advertiser_info } = response;
        if (!response.error) {
            setAdvertiserId(p2p_advertiser_info.id);
            general_store.setIsAdvertiser(!!p2p_advertiser_info.is_approved);
            general_store.setIsListed(p2p_advertiser_info.is_listed === 1);
            setNickname(p2p_advertiser_info.name);
        } else {
            ws_subscriptions.current.advertiser_subscription.unsubscribe();

            if (response.error.code === 'RestrictedCountry') {
                general_store.setIsRestricted(true);
            } else if (response.error.code === 'AdvertiserNotFound') {
                general_store.setIsAdvertiser(false);
            }
        }

        if (!general_store.is_advertiser) {
            requestWS({ get_account_status: 1 }).then(account_response => {
                if (is_mounted.current && !account_response.error) {
                    const { get_account_status } = account_response;
                    const { authentication } = get_account_status;
                    const { identity } = authentication;

                    general_store.setPoiStatus(identity.status);
                }
            });
        }
    };

    const updateP2pNotifications = notifications => {
        const unseen_notifications = notifications.filter(notification => notification.is_seen === false);
        const notification_count = unseen_notifications.length;
        const active_notification_count = unseen_notifications.filter(notification => notification.is_active).length;
        const inactive_notification_count = notification_count - active_notification_count;
        const user_settings = getLocalStorageSettingsForLoginId();
        user_settings.is_cached = true;
        user_settings.notifications = notifications;

        const p2p_settings = getLocalStorageSettings();
        p2p_settings[loginid] = user_settings;

        localStorage.setItem('p2p_settings', JSON.stringify(p2p_settings));

        general_store.setNotificationCount(notification_count);
        general_store.setActiveNotificationCount(active_notification_count);
        general_store.setInactiveNotificationCount(inactive_notification_count);

        if (typeof setNotificationCount === 'function') {
            setNotificationCount(notification_count);
        }
    };

    // render() {

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
                active_notification_count: general_store.active_notification_count,
                advertiser_id,
                changeOrderToggle,
                changeTab: handleTabClick,
                createAdvertiser,
                currency,
                email_domain: getPropertyValue(custom_strings, 'email_domain') || 'deriv.com',
                getLocalStorageSettingsForLoginId,
                handleNotifications,
                inactive_notification_count: general_store.inactive_notification_count,
                is_advertiser: general_store.is_advertiser,
                is_listed: general_store.is_listed,
                is_mobile,
                is_restricted: general_store.is_restricted,
                list_item_limit,
                local_currency_config,
                nickname,
                nickname_error: general_store.nickname_error,
                order_id,
                order_offset: general_store.order_offset,
                order_table_type,
                orders,
                poi_status: general_store.poi_status,
                poi_url,
                residence,
                setChatInfo,
                setIsListed: is_listed => {
                    general_store.setIsListed(is_listed);
                },
                setIsAdvertiser: is_advertiser => {
                    general_store.setIsAdvertiser(is_advertiser);
                },
                setNickname,
                setOrderId,
                setOrders,
                setOrderOffset: order_offset => {
                    general_store.setOrderOffset(order_offset);
                },
                toggleNicknamePopup,
                updateP2pNotifications,
            }}
        >
            <main className={classNames('p2p-cashier', className)}>
                {general_store.show_popup ? (
                    <>
                        {is_mobile ? (
                            <div className='p2p-nickname__dialog'>
                                <NicknameForm
                                    handleClose={onNicknamePopupClose}
                                    handleConfirm={toggleNicknamePopup}
                                    is_mobile
                                />
                            </div>
                        ) : (
                            <Modal is_open={general_store.show_popup} className='p2p-nickname__dialog'>
                                <NicknameForm handleClose={onNicknamePopupClose} handleConfirm={toggleNicknamePopup} />
                            </Modal>
                        )}
                    </>
                ) : (
                    <>
                        {should_show_verification && !general_store.is_advertiser && (
                            <div
                                className={classNames('p2p-cashier__verification', {
                                    'p2p-cashier__verification--mobile': is_mobile,
                                })}
                            >
                                <Verification />
                            </div>
                        )}
                        {should_show_verification && general_store.is_advertiser && <Download />}
                        {!should_show_verification && (
                            <Tabs
                                onTabItemClick={handleTabClick}
                                active_index={general_store.active_index}
                                className='p2p-cashier'
                                top
                                header_fit_content
                            >
                                <div label={localize('Buy / Sell')}>
                                    <BuySell navigate={redirectTo} params={parameters} />
                                </div>
                                <div count={general_store.notification_count} label={localize('Orders')}>
                                    <Orders navigate={redirectTo} params={parameters} chat_info={chat_info} />
                                </div>
                                <div label={localize('My ads')}>
                                    <MyAds navigate={redirectTo} params={parameters} />
                                </div>
                                {/* TODO [p2p-uncomment] uncomment this when profile is ready */}
                                {/* <div label={localize('My profile')}>
                                    <MyProfile navigate={redirectTo} params={parameters} />
                                </div> */}
                            </Tabs>
                        )}
                    </>
                )}
            </main>
        </Dp2pProvider>
    );
};
// };

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
