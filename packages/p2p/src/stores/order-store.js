import { cloneObject } from '@deriv/shared';
import { action, computed, observable, reaction } from 'mobx';
import { createExtendedOrderDetails } from 'Utils/orders';
import { requestWS, subscribeWS } from 'Utils/websocket';

export default class OrderStore {
    constructor(root_store) {
        this.root_store = root_store;

        reaction(
            () => this.orders,
            orders => {
                this.root_store.general_store.handleNotifications(this.previous_orders, orders);
            }
        );
    }

    @observable api_error_message = '';
    @observable has_more_items_to_load = false;
    @observable is_loading = false;
    @observable orders = [];
    @observable order_id = null;
    @observable order_rerender_timeout = null;

    interval;
    order_info_subscription = {};
    previous_orders = [];

    @computed
    get order_information() {
        const { general_store } = this.root_store;
        const order = this.orders.find(o => o.id === this.order_id);

        return order
            ? createExtendedOrderDetails(order, general_store.client.loginid, general_store.props.server_time)
            : null;
    }

    @computed
    get nav() {
        return this.root_store.general_store.parameters?.nav;
    }

    @action.bound
    hideDetails(should_navigate) {
        if (should_navigate && this.nav) {
            this.root_store.general_store.redirectTo(this.nav.location);
        }

        this.setOrderId(null);
    }

    @action.bound
    loadMoreOrders({ startIndex }) {
        return new Promise(resolve => {
            const { general_store } = this.root_store;
            const active = general_store.is_active_tab ? 1 : 0;

            requestWS({
                p2p_order_list: 1,
                active,
                offset: startIndex,
                limit: general_store.list_item_limit,
            }).then(response => {
                if (!response.error) {
                    // Ignore any responses that don't match our request. This can happen
                    // due to quickly switching between Active/Past tabs.
                    if (response.echo_req.active === active) {
                        const { list } = response.p2p_order_list;
                        this.setHasMoreItemsToLoad(list.length >= general_store.list_item_limit);

                        const old_list = [...this.orders];
                        const new_list = [];

                        list.forEach(order => {
                            const old_list_idx = old_list.findIndex(o => o.id === order.id);

                            if (old_list_idx > -1) {
                                old_list[old_list_idx] = order;
                            } else {
                                new_list.push(order);
                            }
                        });

                        this.setOrders([...old_list, ...new_list]);
                    }
                } else {
                    this.setApiErrorMessage(response.error.message);
                }

                this.setIsLoading(false);
                resolve();
            });
        });
    }

    @action.bound
    onOrderIdUpdate() {
        this.unsubscribeFromCurrentOrder();

        if (this.order_id) {
            this.subscribeToCurrentOrder();
        }
    }

    @action.bound
    onOrdersUpdate() {
        if (this.order_id) {
            // If orders was updated, find current viewed order (if any)
            // and trigger a re-render (in case status was updated).
            const order = this.orders.find(o => o.id === this.order_id);

            if (order) {
                this.setQueryDetails(order);
            } else {
                this.root_store.general_store.redirectTo('orders');
            }
        }
    }

    @action.bound
    onUnmount() {
        clearTimeout(this.order_rerender_timeout);
        this.unsubscribeFromCurrentOrder();
        this.hideDetails(false);
    }

    @action.bound
    setApiErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }

    @action.bound
    setHasMoreItemsToLoad(has_more_items_to_load) {
        this.has_more_items_to_load = has_more_items_to_load;
    }

    @action.bound
    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setOrderDetails(response) {
        if (!response.error) {
            const { p2p_order_info } = response;
            this.setQueryDetails(p2p_order_info);
        } else {
            this.unsubscribeFromCurrentOrder();
        }
    }

    @action.bound
    setOrderId(order_id) {
        this.order_id = order_id;

        const { general_store } = this.root_store;

        if (typeof general_store.props.setOrderId === 'function') {
            general_store.props.setOrderId(order_id);
        }
    }

    @action.bound
    setOrders(orders) {
        this.previous_orders = cloneObject(this.orders);
        this.orders = orders;
    }

    @action.bound
    setOrderRendererTimeout(order_rerender_timeout) {
        this.order_rerender_timeout = order_rerender_timeout;
    }

    @action.bound
    setQueryDetails(input_order) {
        const { general_store } = this.root_store;
        const order_information = createExtendedOrderDetails(
            input_order,
            general_store.client.loginid,
            general_store.props.server_time
        );
        this.setOrderId(order_information.id); // Sets the id in URL

        // When viewing specific order, update its read state in localStorage.
        const { notifications } = this.root_store.general_store.getLocalStorageSettingsForLoginId();

        if (notifications.length) {
            const notification = notifications.find(n => n.order_id === order_information.id);

            if (notification) {
                notification.is_seen = true;
                this.root_store.general_store.updateP2pNotifications(notifications);
            }
        }

        // Force a refresh of this order when it's expired to correctly
        // reflect the status of the order. This is to work around a BE issue
        // where they only expire contracts once a minute rather than on expiry time.
        const { remaining_seconds } = order_information;

        if (remaining_seconds > 0) {
            clearTimeout(this.order_rerender_timeout);

            this.setOrderRendererTimeout(
                setTimeout(() => {
                    if (typeof this.forceRerenderFn === 'function') {
                        this.forceRerenderFn(order_information.id);
                    }
                }, (remaining_seconds + 1) * 1000)
            );
        }
    }

    @action.bound
    setData(data) {
        this.data = data;
    }

    @action.bound
    subscribeToCurrentOrder() {
        this.order_info_subscription = subscribeWS(
            {
                p2p_order_info: 1,
                id: this.order_id,
                subscribe: 1,
            },
            [this.setOrderDetails]
        );
    }

    @action.bound
    syncOrder(p2p_order_info) {
        const { general_store } = this.root_store;

        const get_order_status = createExtendedOrderDetails(
            p2p_order_info,
            general_store.client.loginid,
            general_store.props.server_time
        );

        const order_idx = this.orders.findIndex(order => order.id === p2p_order_info.id);

        if (this.order_id === null) {
            // When we're looking at a list, it's safe to move orders from Active to Past.
            if (order_idx === -1) {
                this.orders.unshift(p2p_order_info);
            } else if (get_order_status.is_inactive_order) {
                this.orders.splice(order_idx, 1);
            } else if (get_order_status.is_disputed_order || get_order_status.is_active_order) {
                Object.assign(this.orders[order_idx], p2p_order_info);
            }
        } else if (this.orders[order_idx]) {
            // When looking at a specific order, it's NOT safe to move orders between tabs
            // in this case, only update the order details.
            Object.assign(this.orders[order_idx], p2p_order_info);
        }
    }

    @action.bound
    unsubscribeFromCurrentOrder() {
        clearTimeout(this.order_rerender_timeout);

        if (this.order_info_subscription.unsubscribe) {
            this.order_info_subscription.unsubscribe();
        }
    }

    setForceRerenderOrders(forceRerenderFn) {
        this.forceRerenderFn = forceRerenderFn;
    }
}
