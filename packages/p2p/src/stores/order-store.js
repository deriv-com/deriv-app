import { cloneObject } from '@deriv/shared';
import { action, computed, observable, reaction, makeObservable } from 'mobx';
import { createExtendedOrderDetails } from 'Utils/orders';
import { requestWS, subscribeWS } from 'Utils/websocket';
import { order_list } from 'Constants/order-list';
import { api_error_codes } from '../constants/api-error-codes';

export default class OrderStore {
    constructor(root_store) {
        makeObservable(this, {
            api_error_message: observable,
            cancellation_block_duration: observable,
            cancellation_count_period: observable,
            cancellation_limit: observable,
            cancels_remaining: observable,
            error_message: observable,
            has_more_items_to_load: observable,
            is_email_link_blocked_modal_open: observable,
            is_email_link_verified_modal_open: observable,
            is_email_verification_modal_open: observable,
            is_invalid_verification_link_modal_open: observable,
            is_loading: observable,
            is_loading_modal_open: observable,
            is_rating_modal_open: observable,
            is_recommended: observable,
            orders: observable,
            order_id: observable,
            order_payment_method_details: observable,
            order_rerender_timeout: observable,
            rating_value: observable,
            user_email_address: observable,
            verification_code: observable,
            verification_link_error_message: observable,
            has_order_payment_method_details: computed,
            order_information: computed,
            nav: computed,
            confirmOrderRequest: action.bound,
            confirmOrder: action.bound,
            getAdvertiserInfo: action.bound,
            getP2POrderList: action.bound,
            getSettings: action.bound,
            getWebsiteStatus: action.bound,
            handleRating: action.bound,
            hideDetails: action.bound,
            loadMoreOrders: action.bound,
            onOrderIdUpdate: action.bound,
            onOrdersUpdate: action.bound,
            onPageReturn: action.bound,
            onUnmount: action.bound,
            setForceRerenderOrders: action.bound,
            setApiErrorMessage: action.bound,
            setCancellationBlockDuration: action.bound,
            setCancellationCountPeriod: action.bound,
            setCancellationLimit: action.bound,
            setCancelsRemaining: action.bound,
            setErrorMessage: action.bound,
            setHasMoreItemsToLoad: action.bound,
            setIsEmailLinkBlockedModalOpen: action.bound,
            setIsEmailLinkVerifiedModalOpen: action.bound,
            setIsEmailVerificationModalOpen: action.bound,
            setIsInvalidVerificationLinkModalOpen: action.bound,
            setIsLoading: action.bound,
            setIsLoadingModalOpen: action.bound,
            setIsRatingModalOpen: action.bound,
            setIsRecommended: action.bound,
            setOrderPaymentMethodDetails: action.bound,
            setOrderDetails: action.bound,
            setOrderId: action.bound,
            setOrders: action.bound,
            setOrderRendererTimeout: action.bound,
            setQueryDetails: action.bound,
            setData: action.bound,
            setOrderRating: action.bound,
            subscribeToCurrentOrder: action.bound,
            syncOrder: action.bound,
            unsubscribeFromCurrentOrder: action.bound,
            verifyEmailVerificationCode: action.bound,
            setRatingValue: action.bound,
            setUserEmailAddress: action.bound,
            setVerificationCode: action.bound,
            setVerificationLinkErrorMessage: action.bound,
        });

        this.root_store = root_store;

        reaction(
            () => this.orders,
            orders => {
                this.root_store.general_store.handleNotifications(this.previous_orders, orders);
            }
        );
    }

    api_error_message = '';
    cancellation_block_duration = 0;
    cancellation_count_period = 0;
    cancellation_limit = 0;
    cancels_remaining = null;
    error_message = '';
    has_more_items_to_load = false;
    is_email_link_blocked_modal_open = false;
    is_email_link_verified_modal_open = false;
    is_email_verification_modal_open = false;
    is_invalid_verification_link_modal_open = false;
    is_loading = false;
    is_loading_modal_open = false;
    is_rating_modal_open = false;
    is_recommended = undefined;
    orders = [];
    order_id = null;
    order_payment_method_details = null;
    order_rerender_timeout = null;
    rating_value = 0;
    user_email_address = '';
    verification_code = '';
    verification_link_error_message = '';

    interval;
    order_info_subscription = {};
    previous_orders = [];

    get has_order_payment_method_details() {
        return !!this.order_payment_method_details;
    }

    get order_information() {
        const { general_store } = this.root_store;
        const order = this.orders.find(o => o.id === this.order_id);
        return order
            ? createExtendedOrderDetails(order, general_store.client.loginid, general_store.props.server_time)
            : null;
    }

    get nav() {
        return this.root_store.general_store.parameters?.nav;
    }

    confirmOrderRequest(id, is_buy_order_for_user) {
        const { order_details_store } = this.root_store;
        requestWS({
            p2p_order_confirm: 1,
            id,
        }).then(response => {
            if (response) {
                if (response.error) {
                    if (response.error.code === api_error_codes.ORDER_EMAIL_VERIFICATION_REQUIRED) {
                        clearTimeout(wait);
                        const wait = setTimeout(() => this.setIsEmailVerificationModalOpen(true), 250);
                    } else if (
                        response?.error.code === api_error_codes.INVALID_VERIFICATION_TOKEN ||
                        response?.error.code === api_error_codes.EXCESSIVE_VERIFICATION_REQUESTS
                    ) {
                        clearTimeout(wait);
                        if (this.is_email_verification_modal_open) {
                            this.setIsEmailVerificationModalOpen(false);
                        }
                        if (this.is_email_link_verified_modal_open) {
                            this.setIsEmailLinkVerifiedModalOpen(false);
                        }
                        this.setVerificationLinkErrorMessage(response.error.message);
                        const wait = setTimeout(() => this.setIsInvalidVerificationLinkModalOpen(true), 230);
                    } else if (response?.error.code === api_error_codes.EXCESSIVE_VERIFICATION_FAILURES) {
                        if (this.is_invalid_verification_link_modal_open) {
                            this.setIsInvalidVerificationLinkModalOpen(false);
                        }
                        clearTimeout(wait);
                        this.setVerificationLinkErrorMessage(response.error.message);
                        const wait = setTimeout(() => this.setIsEmailLinkBlockedModalOpen(true), 230);
                    } else {
                        order_details_store.setErrorMessage(response.error.message);
                    }
                } else if (!is_buy_order_for_user) {
                    this.setIsRatingModalOpen(true);
                }

                localStorage.removeItem('verification_code.p2p_order_confirm');
            }
        });
    }

    confirmOrder(is_buy_order_for_user) {
        requestWS({
            p2p_order_confirm: 1,
            id: this.order_id,
            verification_code: this.verification_code,
        }).then(response => {
            if (response && !response.error) {
                if (!is_buy_order_for_user) {
                    clearTimeout(wait);
                    const wait = setTimeout(() => {
                        this.setIsRatingModalOpen(true);
                    }, 230);
                }
            }
        });
    }

    getAdvertiserInfo(setShouldShowCancelModal) {
        requestWS({ p2p_advertiser_info: 1 }).then(response => {
            if (response.error) {
                this.setErrorMessage(response.error.message);
            } else {
                this.setCancelsRemaining(response.p2p_advertiser_info.cancels_remaining);
            }
        });
        this.getWebsiteStatus(setShouldShowCancelModal);
    }

    getP2POrderList() {
        requestWS({ p2p_order_list: 1 }).then(response => {
            if (response) {
                if (response.error) {
                    this.setErrorMessage(response.error.message);
                } else {
                    const { p2p_order_list } = response;

                    this.root_store.general_store.handleNotifications(this.orders, p2p_order_list.list);
                    p2p_order_list.list.forEach(order => this.syncOrder(order));
                    this.setOrders(p2p_order_list.list);
                }
            }
        });
    }

    getSettings() {
        requestWS({ get_settings: 1 }).then(response => {
            if (response && !response.error) {
                this.setUserEmailAddress(response.get_settings.email);
            }
        });
    }

    getWebsiteStatus(setShouldShowCancelModal) {
        requestWS({ website_status: 1 }).then(response => {
            if (response.error) {
                this.setErrorMessage(response.error.message);
            } else {
                const { p2p_config } = response.website_status;
                this.setCancellationBlockDuration(p2p_config.cancellation_block_duration);
                this.setCancellationCountPeriod(p2p_config.cancellation_count_period);
                this.setCancellationLimit(p2p_config.cancellation_limit);
            }
            if (typeof setShouldShowCancelModal === 'function') {
                setShouldShowCancelModal(true);
            }
        });
    }

    handleRating(rate) {
        this.setRatingValue(rate);
    }

    hideDetails(should_navigate) {
        if (should_navigate && this.nav) {
            this.root_store.general_store.redirectTo(this.nav.location);
        }
        this.setOrderId(null);
    }

    loadMoreOrders({ startIndex }) {
        this.setApiErrorMessage('');
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
                } else if (response.error.code === api_error_codes.PERMISSION_DENIED) {
                    this.root_store.general_store.setIsBlocked(true);
                } else {
                    this.setApiErrorMessage(response.error.message);
                }

                this.setIsLoading(false);
                resolve();
            });
        });
    }

    onOrderIdUpdate() {
        this.unsubscribeFromCurrentOrder();

        if (this.order_id) {
            this.subscribeToCurrentOrder();
        }
    }

    async onOrdersUpdate() {
        if (this.order_id) {
            // If orders was updated, find current viewed order (if any)
            // and trigger a re-render (in case status was updated).

            await requestWS({ p2p_order_info: 1, id: this.order_id }).then(response => {
                if (!response?.error) {
                    const { p2p_order_info } = response;
                    if (p2p_order_info) {
                        this.setQueryDetails(p2p_order_info);
                    } else {
                        this.root_store.general_store.redirectTo('orders');
                    }
                }
            });
        }
    }

    onPageReturn() {
        this.hideDetails(true);
    }

    onUnmount() {
        clearTimeout(this.order_rerender_timeout);
        this.unsubscribeFromCurrentOrder();
        this.hideDetails(false);
    }

    setOrderDetails(response) {
        if (response) {
            if (!response?.error) {
                const { p2p_order_info } = response;

                this.setQueryDetails(p2p_order_info);
            } else {
                this.unsubscribeFromCurrentOrder();
            }
        }
    }

    setOrderRating(id) {
        const rating = this.rating_value / 20;

        requestWS({
            p2p_order_review: 1,
            order_id: id,
            rating,
            ...(this.is_recommended === undefined ? {} : { recommended: this.is_recommended }),
        }).then(response => {
            if (response) {
                if (response.error) {
                    this.setErrorMessage(response.error.message);
                }
                this.getP2POrderList();
                this.setIsRatingModalOpen(false);
                this.setRatingValue(0);
            }
        });
    }

    setQueryDetails(input_order) {
        const { general_store } = this.root_store;
        const order_information = createExtendedOrderDetails(
            input_order,
            general_store.client.loginid,
            general_store.props.server_time
        );
        this.setOrderId(order_information.id); // Sets the id in URL
        if (order_information.is_active_order) {
            general_store.setOrderTableType(order_list.ACTIVE);
        } else {
            general_store.setOrderTableType(order_list.INACTIVE);
        }
        if (order_information?.payment_method_details) {
            this.setOrderPaymentMethodDetails(Object.values(order_information?.payment_method_details));
        }
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

    syncOrder(p2p_order_info) {
        const { general_store } = this.root_store;

        const get_order_status = createExtendedOrderDetails(
            p2p_order_info,
            general_store.client.loginid,
            general_store.props.server_time
        );

        const order_idx = this.orders.findIndex(order => order.id === p2p_order_info.id);

        // Checking for null since that's the initial value, we don't want to check for !this.order_id
        // since it can be undefined or any other value that we wouldn't need
        if (this.order_id === null) {
            // When we're looking at a list, it's safe to move orders from Active to Past.
            if (order_idx === -1) {
                this.orders.unshift(p2p_order_info);
            } else if (
                (get_order_status.is_completed_order && get_order_status.has_review_details) ||
                !get_order_status.is_reviewable
            ) {
                Object.assign(this.orders[order_idx], p2p_order_info);
            } else if (get_order_status.is_disputed_order || get_order_status.is_active_order) {
                Object.assign(this.orders[order_idx], p2p_order_info);
            } else if (get_order_status.is_inactive_order) {
                this.orders.splice(order_idx, 1);
            }
        } else if (this.orders[order_idx]) {
            // When looking at a specific order, it's NOT safe to move orders between tabs
            // in this case, only update the order details.
            Object.assign(this.orders[order_idx], p2p_order_info);
        }

        if (get_order_status.is_completed_order && !get_order_status.is_reviewable) {
            // Remove notification once order review period is finished
            const notification_key = `order-${p2p_order_info.id}`;
            general_store.props.removeNotificationMessage({ key: notification_key });
            general_store.props.removeNotificationByKey({ key: notification_key });
        }
    }

    unsubscribeFromCurrentOrder() {
        clearTimeout(this.order_rerender_timeout);

        if (this.order_info_subscription.unsubscribe) {
            this.order_info_subscription.unsubscribe();
        }
    }

    verifyEmailVerificationCode(verification_action, verification_code) {
        if (verification_action === 'p2p_order_confirm' && verification_code) {
            requestWS({
                p2p_order_confirm: 1,
                id: this.order_id,
                verification_code,
                dry_run: 1,
            }).then(response => {
                this.setIsLoadingModalOpen(false);
                if (response) {
                    if (!response.error) {
                        clearTimeout(wait);
                        const wait = setTimeout(() => this.setIsEmailLinkVerifiedModalOpen(true), 650);
                    } else if (
                        response.error.code === api_error_codes.INVALID_VERIFICATION_TOKEN ||
                        response.error.code === api_error_codes.EXCESSIVE_VERIFICATION_REQUESTS
                    ) {
                        clearTimeout(wait);
                        this.setVerificationLinkErrorMessage(response.error.message);
                        const wait = setTimeout(() => this.setIsInvalidVerificationLinkModalOpen(true), 750);
                    } else if (response.error.code === api_error_codes.EXCESSIVE_VERIFICATION_FAILURES) {
                        if (this.is_invalid_verification_link_modal_open) {
                            this.setIsInvalidVerificationLinkModalOpen(false);
                        }
                        clearTimeout(wait);
                        this.setVerificationLinkErrorMessage(response.error.message);
                        const wait = setTimeout(() => this.setIsEmailLinkBlockedModalOpen(true), 600);
                    }
                    localStorage.removeItem('verification_code.p2p_order_confirm');
                }
            });
        }
    }

    setApiErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }

    setCancellationBlockDuration(cancellation_block_duration) {
        this.cancellation_block_duration = cancellation_block_duration;
    }

    setCancellationCountPeriod(cancellation_count_period) {
        this.cancellation_count_period = cancellation_count_period;
    }

    setCancellationLimit(cancellation_limit) {
        this.cancellation_limit = cancellation_limit;
    }

    setCancelsRemaining(cancels_remaining) {
        this.cancels_remaining = cancels_remaining;
    }

    setData(data) {
        this.data = data;
    }

    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    setForceRerenderOrders(forceRerenderFn) {
        this.forceRerenderFn = forceRerenderFn;
    }

    setHasMoreItemsToLoad(has_more_items_to_load) {
        this.has_more_items_to_load = has_more_items_to_load;
    }

    setIsEmailLinkBlockedModalOpen(is_email_link_blocked_modal_open) {
        this.is_email_link_blocked_modal_open = is_email_link_blocked_modal_open;
    }

    setIsEmailLinkVerifiedModalOpen(is_email_link_verified_modal_open) {
        this.is_email_link_verified_modal_open = is_email_link_verified_modal_open;
    }

    setIsEmailVerificationModalOpen(is_email_verification_modal_open) {
        this.is_email_verification_modal_open = is_email_verification_modal_open;
    }

    setIsInvalidVerificationLinkModalOpen(is_invalid_verification_link_modal_open) {
        this.is_invalid_verification_link_modal_open = is_invalid_verification_link_modal_open;
    }

    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    setIsLoadingModalOpen(is_loading_modal_open) {
        this.is_loading_modal_open = is_loading_modal_open;
    }

    setIsRatingModalOpen(is_rating_modal_open) {
        this.is_rating_modal_open = is_rating_modal_open;
    }

    setIsRecommended(is_recommended) {
        this.is_recommended = is_recommended;
    }

    setOrders(orders) {
        this.previous_orders = cloneObject(this.orders);
        this.orders = orders;
    }

    setOrderId(order_id) {
        this.order_id = order_id;

        const { general_store } = this.root_store;

        if (typeof general_store.props.setOrderId === 'function') {
            general_store.props.setOrderId(order_id);
        }
    }

    setOrderPaymentMethodDetails(order_payment_method_details) {
        this.order_payment_method_details = order_payment_method_details;
    }

    setOrderRendererTimeout(order_rerender_timeout) {
        this.order_rerender_timeout = order_rerender_timeout;
    }

    setRatingValue(rating_value) {
        this.rating_value = rating_value;
    }

    setUserEmailAddress(user_email_address) {
        this.user_email_address = user_email_address;
    }

    // This is only for the order confirmation request,
    // since on confirmation the code is removed from the query params
    setVerificationCode(verification_code) {
        this.verification_code = verification_code;
    }

    setVerificationLinkErrorMessage(verification_link_error_message) {
        this.verification_link_error_message = verification_link_error_message;
    }
}
