import { observable, action, runInAction } from 'mobx';
import { isEmptyObject, epochToMoment, getSocketURL } from '@deriv/shared';
import { orderToggleIndex } from 'Components/orders/order-info.js';
import { createExtendedOrderDetails } from 'Utils/orders.js';
import { init as WebsocketInit, requestWS, subscribeWS } from 'Utils/websocket.js';

export default class GeneralStore {
    @observable active_index = 0;
    @observable active_notification_count = 0;
    @observable advertiser_id = null;
    @observable chat_info = {
        app_id: '',
        user_id: '',
        token: '',
    };
    @observable inactive_notification_count = 0;
    @observable is_advertiser = false;
    @observable is_listed = false;
    @observable is_restricted = false;
    @observable nickname = null;
    @observable nickname_error = null;
    @observable notification_count = 0;
    @observable order_offset = 0;
    @observable order_table_type = orderToggleIndex.ACTIVE;
    @observable orders = [];
    @observable parameters = null;
    @observable poi_status = null;
    @observable show_popup = false;

    list_item_limit = 20;
    path = {
        buy_sell: 0,
        orders: 1,
        my_ads: 2,
        my_profile: 3,
    };
    props = {};
    ws_subscriptions = {};
    service_token_timeout;

    get client() {
        return this.props?.client || {};
    }

    get is_active_tab() {
        return this.order_table_type === orderToggleIndex.ACTIVE;
    }

    @action.bound
    createAdvertiser = name => {
        return new Promise(resolve => {
            requestWS({ p2p_advertiser_create: 1, name }).then(response => {
                const { p2p_advertiser_create } = response;
                if (response) {
                    if (response.error) {
                        this.setNicknameError(response.error.message);
                    } else {
                        this.setAdvertiserId(p2p_advertiser_create.id);
                        this.setIsAdvertiser(!!p2p_advertiser_create.is_approved);
                        this.setNickname(p2p_advertiser_create.name);
                        this.setNicknameError(undefined);
                        this.setChatInfo(response);
                        this.toggleNicknamePopup();
                    }
                    resolve();
                }
            });
        });
    };

    getLocalStorageSettings = () => JSON.parse(localStorage.getItem('p2p_settings') || '{}');

    getLocalStorageSettingsForLoginId = () => {
        const local_storage_settings = this.getLocalStorageSettings()[this.client.loginid];

        if (isEmptyObject(local_storage_settings)) {
            return { is_cached: false, notifications: [] };
        } else {
            return local_storage_settings;
        }
    };

    @action.bound
    handleNotifications(old_orders, new_orders) {
        const { client, props } = this;
        const { is_cached, notifications } = this.getLocalStorageSettingsForLoginId();
        new_orders.forEach(new_order => {
            const order_info = createExtendedOrderDetails(new_order, client.loginid, props.server_time);
            const notification = notifications.find(n => n.order_id === new_order.id);
            const old_order = old_orders.find(o => o.id === new_order.id);
            const is_current_order = new_order.id === this.props?.order_id;
            const notification_obj = {
                order_id: new_order.id,
                is_seen: is_current_order,
                is_active: order_info.is_active_order,
            };

            if (old_order) {
                if (old_order.status !== new_order.status) {
                    if (notification) {
                        // If order status changed, notify the user.
                        notification.is_seen = is_current_order;
                        notification.is_active = order_info.is_active_order;
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
    }

    @action.bound
    handleTabClick(idx) {
        this.setActiveIndex(idx);
        this.setParameters(null);
    }

    @action.bound
    onMount() {
        this.ws_subscriptions = {
            advertiser_subscription: subscribeWS(
                {
                    p2p_advertiser_info: 1,
                    subscribe: 1,
                },
                [this.updateAdvertiserInfo, this.setChatInfo]
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
    }

    @action.bound
    onUnmount() {
        clearTimeout(this.service_token_timeout);
        Object.keys(this.ws_subscriptions).forEach(key => this.ws_subscriptions[key].unsubscribe());
    }

    @action.bound
    onNicknamePopupClose() {
        this.setShowPopup(false);
    }

    @action.bound
    redirectTo(path_name, params = null) {
        this.setActiveIndex(this.path[path_name]);
        this.setParameters(params);
    }

    @action.bound
    resetNicknameErrorState = () => {
        this.setNicknameError(undefined);
    };

    @action.bound
    setActiveIndex(active_index) {
        this.active_index = active_index;
    }

    @action.bound
    setActiveNotificationCount(active_notification_count) {
        this.active_notification_count = active_notification_count;
    }

    @action.bound
    setAdvertiserId(advertiser_id) {
        this.advertiser_id = advertiser_id;
    }

    setAppProps(props) {
        this.props = props;
    }

    @action.bound
    setChatInfo(response) {
        if (this.service_token_timeout) return;
        if (response.error) {
            this.ws_subscriptions.advertiser_subscription?.unsubscribe();
            return;
        }

        // Response could be both from p2p_advertiser_create or p2p_advertiser_info.
        const advertiser_info = response.p2p_advertiser_create || response.p2p_advertiser_info;

        const getSendbirdServiceToken = () => {
            requestWS({ service: 'sendbird', service_token: 1 }).then(service_token_response => {
                if (service_token_response.error) {
                    return;
                }

                const { service_token } = service_token_response;

                runInAction(() => {
                    this.chat_info = {
                        app_id: getSocketURL().endsWith('binaryws.com')
                            ? '1465991C-5D64-4C88-8BD9-B0D7A6455E69'
                            : '4E259BA5-C383-4624-89A6-8365E06D9D39',
                        user_id: advertiser_info.chat_user_id,
                        token: service_token.sendbird.token,
                    };
                });

                // Refresh chat token ±1 hour before it expires (BE will refresh the token
                // when we request within 2 hours of the token expiring)
                const expiry_moment = epochToMoment(service_token.sendbird.expiry_time);
                const delay_ms = expiry_moment.diff(
                    this.props.server_time
                        .get()
                        .clone()
                        .subtract(1, 'hour')
                );

                this.service_token_timeout = setTimeout(() => getSendbirdServiceToken(), delay_ms);
            });
        };

        getSendbirdServiceToken();
    }

    @action.bound
    setInactiveNotificationCount(inactive_notification_count) {
        this.inactive_notification_count = inactive_notification_count;
    }

    @action.bound
    setIsAdvertiser(is_advertiser) {
        this.is_advertiser = is_advertiser;
    }

    @action.bound
    setIsListed(is_listed) {
        this.is_listed = is_listed;
    }

    @action.bound
    setIsRestricted(is_restricted) {
        this.is_restricted = is_restricted;
    }

    @action.bound
    setNickname(nickname) {
        this.nickname = nickname;
    }

    @action.bound
    setNicknameError(nickname_error) {
        this.nickname_error = nickname_error;
    }

    @action.bound
    setNotificationCount(notification_count) {
        this.notification_count = notification_count;
    }

    @action.bound
    setOrderOffset(order_offset) {
        this.order_offset = order_offset;
    }

    @action.bound
    setOrderTableType(order_table_type) {
        this.order_table_type = order_table_type;
    }

    @action.bound
    setOrders(orders) {
        this.orders = orders;
    }

    @action.bound
    setP2pOrderList(order_response) {
        if (order_response.error) {
            this.ws_subscriptions.order_list_subscription.unsubscribe();
            return;
        }
        const { p2p_order_list, p2p_order_info } = order_response;

        if (p2p_order_list) {
            const { list } = p2p_order_list;
            // it's an array of orders from p2p_order_list
            this.handleNotifications(this.orders, list);
            this.setOrderOffset(list.length);
            this.setOrders(list);
        } else if (p2p_order_info) {
            // it's a single order from p2p_order_info
            const idx_order_to_update = this.orders.findIndex(order => order.id === p2p_order_info.id);
            const updated_orders = [...this.orders];
            // if it's a new order, add it to the top of the list
            if (idx_order_to_update < 0) {
                updated_orders.unshift(p2p_order_info);
            } else {
                // otherwise, update the correct order
                updated_orders[idx_order_to_update] = p2p_order_info;
            }
            // trigger re-rendering by setting orders again
            this.handleNotifications(this.orders, updated_orders);
            this.setOrderOffset(updated_orders.length);
            this.setOrders(updated_orders);
        }
    }

    @action.bound
    setParameters(parameters) {
        this.parameters = parameters;
    }

    @action.bound
    setPoiStatus(poi_status) {
        this.poi_status = poi_status;
    }

    @action.bound
    setShowPopup(show_popup) {
        this.show_popup = show_popup;
    }

    @action.bound
    setWebsocketInit = (websocket, local_currency_decimal_places) => {
        WebsocketInit(websocket, local_currency_decimal_places);
    };

    @action.bound
    toggleNicknamePopup() {
        this.setShowPopup(!this.show_popup);
        this.resetNicknameErrorState();
    }

    @action.bound
    updateAdvertiserInfo(response) {
        const { p2p_advertiser_info } = response;

        if (!response.error) {
            this.setAdvertiserId(p2p_advertiser_info.id);
            this.setIsAdvertiser(!!p2p_advertiser_info.is_approved);
            this.setIsListed(!!p2p_advertiser_info.is_listed);
            this.setNickname(p2p_advertiser_info.name);
        } else {
            this.ws_subscriptions.advertiser_subscription.unsubscribe();

            if (response.error.code === 'RestrictedCountry') {
                this.setIsRestricted(true);
            } else if (response.error.code === 'AdvertiserNotFound') {
                this.setIsAdvertiser(false);
            }
        }

        if (!this.is_advertiser) {
            requestWS({ get_account_status: 1 }).then(account_response => {
                if (!account_response.error) {
                    const { get_account_status } = account_response;
                    const { authentication } = get_account_status;
                    const { identity } = authentication;

                    this.setPoiStatus(identity.status);
                }
            });
        }
    }

    @action.bound
    updateP2pNotifications(notifications) {
        const unseen_notifications = notifications.filter(notification => notification.is_seen === false);
        const notification_count = unseen_notifications.length;
        const active_notification_count = unseen_notifications.filter(notification => notification.is_active).length;
        const inactive_notification_count = notification_count - active_notification_count;
        const user_settings = this.getLocalStorageSettingsForLoginId();
        user_settings.is_cached = true;
        user_settings.notifications = notifications;

        const p2p_settings = this.getLocalStorageSettings();
        p2p_settings[this.client.loginid] = user_settings;

        localStorage.setItem('p2p_settings', JSON.stringify(p2p_settings));

        this.setNotificationCount(notification_count);
        this.setActiveNotificationCount(active_notification_count);
        this.setInactiveNotificationCount(inactive_notification_count);

        if (typeof this.props?.setNotificationCount === 'function') {
            this.props.setNotificationCount(notification_count);
        }
    }
}
