import { action, observable } from 'mobx';
import { createExtendedOrderDetails } from 'Utils/orders';
import { requestWS, subscribeWS } from 'Utils/websocket';
import { height_constants } from 'Utils/height_constants';
import { localize } from 'Components/i18next';
import { secondsToTimer } from 'Utils/date-time';
import ServerTime from 'Utils/server-time';

export default class OrderStore {
    constructor(root_store) {
        this.root_store = root_store;
        this.general_store = this.root_store.general_store;
    }

    @observable api_error_message = '';
    @observable has_more_items_to_load = false;
    @observable is_loading = false;
    @observable nav = this.general_store.parameters?.nav;
    @observable order_information = null;
    @observable order_rerender_timeout = null;
    @observable order_state = this.order;
    @observable remaining_time = null;

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
    row_props = {};

    get order_expiry_milliseconds() {
        return this.order?.order_expiry_milliseconds;
    }

    get order() {
        return this.row_props?.data;
    }

    get style() {
        return this.row_props?.style;
    }

    @action.bound
    countDownTimer = () => {
        const distance = ServerTime.getDistanceToServerTime(this.order_expiry_milliseconds);
        const timer = secondsToTimer(distance);

        if (distance < 1) {
            const { client, props } = this.general_store;
            this.setRemainingTime(localize('expired'));
            this.setOrderState(createExtendedOrderDetails(this.order.order_details, client.loginid, props.server_time));
            clearInterval(this.interval);
        } else {
            this.setRemainingTime(timer);
        }
    };

    @action.bound
    hideDetails(should_navigate) {
        if (should_navigate && this.nav) {
            this.general_store.redirectTo(this.nav.location);
        }
        this.general_store.props.setOrderId(null);
        this.setOrderInformation(null);
    }

    @action.bound
    isOrderSeen = order_id => {
        const { notifications } = this.general_store.getLocalStorageSettingsForLoginId();
        return notifications.some(notification => notification.order_id === order_id && notification.is_seen === true);
    };

    @action.bound
    loadMoreOrders() {
        requestWS({
            p2p_order_list: 1,
            offset: this.general_store.order_offset,
            limit: this.general_store.list_item_limit,
            active: this.general_store.is_active_tab ? 1 : 0,
        }).then(response => {
            if (!response.error) {
                const { list } = response.p2p_order_list;
                this.setHasMoreItemsToLoad(list.length >= this.general_store.list_item_limit);
                this.general_store.setOrders(this.general_store.orders.concat(list));
                this.general_store.setOrderOffset(this.general_store.order_offset + list.length);
            } else {
                this.setApiErrorMessage(response.error.message);
            }
            this.setIsLoading(false);
        });
    }

    @action.bound
    onOrderIdUpdate() {
        this.unsubscribeFromCurrentOrder();

        if (this.general_store.props.order_id) {
            this.subscribeToCurrentOrder();
        }
    }

    @action.bound
    onOrdersUpdate() {
        if (this.general_store.props.order_id) {
            // If orders was updated, find current viewed order (if any)
            // and trigger a re-render (in case status was updated).
            const order = this.general_store.orders.find(o => o.id === this.general_store.props.order_id);

            if (order) {
                this.setQueryDetails(order);
            } else {
                this.general_store.redirectTo('orders');
            }
        }
    }

    @action.bound
    onParametersUpdate() {
        this.setNav(this.general_store.parameters?.nav ?? this.nav);
    }

    @action.bound
    onRowMount() {
        this.countDownTimer();
        this.interval = setInterval(this.countDownTimer, 1000);
    }

    @action.bound
    onRowUnmount() {
        clearInterval(this.interval);
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
    setNav(nav) {
        this.nav = nav;
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
        this.order_information = order_information;
    }

    @action.bound
    setOrderRendererTimeout(order_rerender_timeout) {
        this.order_rerender_timeout = order_rerender_timeout;
    }

    @action.bound
    setOrderState(order_state) {
        this.order_state = order_state;
    }

    @action.bound
    setQueryDetails = input_order => {
        const { client, props } = this.general_store;
        const input_order_information = createExtendedOrderDetails(input_order, client.loginid, props.server_time);

        this.general_store.props.setOrderId(input_order_information.id); // Sets the id in URL
        this.setOrderInformation(input_order_information);

        // When viewing specific order, update its read state in localStorage.
        const { notifications } = this.general_store.getLocalStorageSettingsForLoginId();

        if (notifications.length) {
            const notification = notifications.find(n => n.order_id === input_order_information.id);

            if (notification) {
                notification.is_seen = true;
                this.general_store.updateP2pNotifications(notifications);
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
                }, remaining_seconds + 1 * 1000)
            );
        }
    };

    @action.bound
    setRemainingTime(remaining_time) {
        this.remaining_time = remaining_time;
    }

    @action.bound
    setRowProps(row_props) {
        this.row_props = row_props;
    }
    @action.bound
    subscribeToCurrentOrder() {
        this.order_info_subscription = subscribeWS(
            {
                p2p_order_info: 1,
                id: this.general_store.props.order_id,
                subscribe: 1,
            },
            [this.setOrderDetails]
        );
    }

    @action.bound
    unsubscribeFromCurrentOrder() {
        clearTimeout(this.order_rerender_timeout);

        if (this.order_info_subscription.unsubscribe) {
            this.order_info_subscription.unsubscribe();
        }
    }
}
