import { action, computed, observable } from 'mobx';
import { createExtendedOrderDetails } from 'Utils/orders';
import { requestWS, subscribeWS } from 'Utils/websocket';
import { height_constants } from 'Utils/height_constants';

export default class OrderStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable api_error_message = '';
    @observable has_more_items_to_load = false;
    @observable is_loading = false;
    @observable order_rerender_timeout = null;

    height_values = [
        height_constants.screen,
        height_constants.core_header,
        height_constants.page_overlay_header,
        height_constants.page_overlay_content_padding,
        height_constants.tabs,
        height_constants.filters,
        height_constants.filters_margin,
        height_constants.table_header,
        height_constants.core_footer,
    ];
    interval;
    item_height = 72;
    order_info_subscription = {};

    @computed
    get order_information() {
        return this.root_store.general_store.order_information;
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
        this.root_store.general_store.props.setOrderId(null);
        this.setOrderInformation(null);
    }

    @action.bound
    loadMoreOrders() {
        requestWS({
            p2p_order_list: 1,
            offset: this.root_store.general_store.order_offset,
            limit: this.root_store.general_store.list_item_limit,
            active: this.root_store.general_store.is_active_tab ? 1 : 0,
        }).then(response => {
            if (!response.error) {
                const { list } = response.p2p_order_list;
                this.setHasMoreItemsToLoad(list.length >= this.root_store.general_store.list_item_limit);
                this.root_store.general_store.setOrders(this.root_store.general_store.orders.concat(list));
                this.root_store.general_store.setOrderOffset(this.root_store.general_store.order_offset + list.length);
            } else {
                this.setApiErrorMessage(response.error.message);
            }
            this.setIsLoading(false);
        });
    }

    @action.bound
    onOrderIdUpdate() {
        this.unsubscribeFromCurrentOrder();

        if (this.root_store.general_store.props.order_id) {
            this.subscribeToCurrentOrder();
        }
    }

    @action.bound
    onOrdersUpdate() {
        if (this.root_store.general_store.props.order_id) {
            // If orders was updated, find current viewed order (if any)
            // and trigger a re-render (in case status was updated).
            const order = this.root_store.general_store.orders.find(
                o => o.id === this.root_store.general_store.props.order_id
            );

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
    setOrderInformation(order_information) {
        this.root_store.general_store.setOrderInformation(order_information);
    }

    @action.bound
    setOrderRendererTimeout(order_rerender_timeout) {
        this.order_rerender_timeout = order_rerender_timeout;
    }

    @action.bound
    setQueryDetails = input_order => {
        const { client, props } = this.root_store.general_store;
        const input_order_information = createExtendedOrderDetails(input_order, client.loginid, props.server_time);

        this.root_store.general_store.props.setOrderId(input_order_information.id); // Sets the id in URL
        this.setOrderInformation(input_order_information);

        // When viewing specific order, update its read state in localStorage.
        const { notifications } = this.root_store.general_store.getLocalStorageSettingsForLoginId();

        if (notifications.length) {
            const notification = notifications.find(n => n.order_id === input_order_information.id);

            if (notification) {
                notification.is_seen = true;
                this.root_store.general_store.updateP2pNotifications(notifications);
            }
        }

        // Force a refresh of this order when it's expired to correctly
        // reflect the status of the order. This is to work around a BE issue
        // where they only expire contracts once a minute rather than on expiry time.
        const { remaining_seconds } = input_order_information;

        if (remaining_seconds > 0) {
            clearTimeout(this.order_rerender_timeout);

            this.setOrderRendererTimeout(
                setTimeout(() => {
                    this.setQueryDetails(input_order);
                }, (remaining_seconds + 1) * 1000)
            );
        }
    };

    @action.bound
    setData(data) {
        this.data = data;
    }
    @action.bound
    subscribeToCurrentOrder() {
        this.order_info_subscription = subscribeWS(
            {
                p2p_order_info: 1,
                id: this.root_store.general_store.props.order_id,
                subscribe: 1,
            },
            [this.setOrderDetails]
        );
    }

    syncOrder(p2p_order_info) {
        const get_order_status = createExtendedOrderDetails(
            p2p_order_info,
            this.root_store.general_store.client.loginid,
            this.root_store.general_store.props.server_time
        );

        const order_idx = this.root_store.general_store.orders.findIndex(order => {
            if (order.id === p2p_order_info.id) {
                return true;
            } else {
                return false;
            }
        });

        if (order_idx < 0) {
            this.root_store.general_store.orders.unshift(p2p_order_info);
        }

        if (get_order_status.is_inactive_order) {
            this.root_store.general_store.orders.splice(order_idx, 1);
        }
        if (get_order_status.is_disputed_order || get_order_status.is_active_order) {
            this.root_store.general_store.orders[order_idx] = p2p_order_info;
        }
    }

    @action.bound
    unsubscribeFromCurrentOrder() {
        clearTimeout(this.order_rerender_timeout);

        if (this.order_info_subscription.unsubscribe) {
            this.order_info_subscription.unsubscribe();
        }
    }
}
