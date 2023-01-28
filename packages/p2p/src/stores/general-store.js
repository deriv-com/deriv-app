import React from 'react';
import { action, computed, observable, reaction, makeObservable } from 'mobx';
import { isEmptyObject, isMobile, toMoment } from '@deriv/shared';
import BaseStore from 'Stores/base_store';
import { localize, Localize } from 'Components/i18next';
import { convertToMillis, getFormattedDateString } from 'Utils/date-time';
import { createExtendedOrderDetails } from 'Utils/orders';
import { init as WebsocketInit, requestWS, subscribeWS } from 'Utils/websocket';
import { order_list } from 'Constants/order-list';
import { buy_sell } from 'Constants/buy-sell';
import { api_error_codes } from '../constants/api-error-codes';

export default class GeneralStore extends BaseStore {
    active_index = 0;
    active_notification_count = 0;
    advertiser_buy_limit = null;
    advertiser_id = null;
    advertiser_info = {};
    advertiser_sell_limit = null;
    advertiser_relations_response = []; //TODO: Remove this when backend has fixed is_blocked flag issue
    block_unblock_user_error = '';
    balance;
    cancels_remaining = null;
    contact_info = '';
    feature_level = null;
    inactive_notification_count = 0;
    is_advertiser = false;
    is_advertiser_blocked = null;
    is_blocked = false;
    is_block_unblock_user_loading = false;
    is_block_user_modal_open = false;
    is_high_risk_fully_authed_without_fa = false;
    is_listed = false;
    is_loading = false;
    is_modal_open = false;
    is_p2p_blocked_for_pa = false;
    is_restricted = false;
    nickname = null;
    nickname_error = '';
    notification_count = 0;
    order_table_type = order_list.ACTIVE;
    orders = [];
    parameters = null;
    payment_info = '';
    poi_status = null;
    props = {};
    review_period;
    should_show_real_name = false;
    should_show_popup = false;
    user_blocked_count = 0;
    user_blocked_until = null;

    list_item_limit = isMobile() ? 10 : 50;
    path = {
        buy_sell: 0,
        orders: 1,
        my_ads: 2,
        my_profile: 3,
    };
    ws_subscriptions = {};
    service_token_timeout;

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            active_index: observable,
            active_notification_count: observable,
            advertiser_id: observable,
            advertiser_buy_limit: observable,
            advertiser_sell_limit: observable,
            advertiser_relations_response: observable, //TODO: Remove this when backend has fixed is_blocked flag issue
            block_unblock_user_error: observable,
            balance: observable,
            feature_level: observable,
            inactive_notification_count: observable,
            is_advertiser: observable,
            is_advertiser_blocked: observable,
            is_blocked: observable,
            is_block_unblock_user_loading: observable,
            is_block_user_modal_open: observable,
            is_listed: observable,
            is_loading: observable,
            is_p2p_blocked_for_pa: observable,
            is_restricted: observable,
            nickname: observable,
            nickname_error: observable,
            notification_count: observable,
            order_table_type: observable,
            orders: observable,
            parameters: observable,
            poi_status: observable,
            props: observable.ref,
            review_period: observable,
            should_show_real_name: observable,
            should_show_popup: observable,
            user_blocked_count: observable,
            user_blocked_until: observable,
            is_high_risk_fully_authed_without_fa: observable,
            is_modal_open: observable,
            client: computed,
            current_focus: computed,
            setCurrentFocus: computed,
            blocked_until_date_time: computed,
            is_active_tab: computed,
            is_barred: computed,
            is_my_profile_tab_visible: computed,
            should_show_dp2p_blocked: computed,
            blockUnblockUser: action.bound,
            createAdvertiser: action.bound,
            getWebsiteStatus: action.bound,
            handleNotifications: action.bound,
            redirectToOrderDetails: action.bound,
            showCompletedOrderNotification: action.bound,
            handleTabClick: action.bound,
            onMount: action.bound,
            subscribeToLocalCurrency: action.bound,
            onUnmount: action.bound,
            onNicknamePopupClose: action.bound,
            redirectTo: action.bound,
            setActiveIndex: action.bound,
            setActiveNotificationCount: action.bound,
            setAccountBalance: action.bound,
            setAdvertiserId: action.bound,
            setAdvertiserBuyLimit: action.bound,
            setAdvertiserSellLimit: action.bound,
            setAppProps: action.bound,
            setAdvertiserRelationsResponse: action.bound, //TODO: Remove this when backend has fixed is_blocked flag issue
            setFeatureLevel: action.bound,
            setInactiveNotificationCount: action.bound,
            setIsAdvertiser: action.bound,
            setIsBlocked: action.bound,
            setIsHighRiskFullyAuthedWithoutFa: action.bound,
            setIsListed: action.bound,
            setIsLoading: action.bound,
            setIsP2pBlockedForPa: action.bound,
            setIsRestricted: action.bound,
            setIsModalOpen: action.bound,
            setNickname: action.bound,
            setNicknameError: action.bound,
            setNotificationCount: action.bound,
            setOrderTableType: action.bound,
            setP2PConfig: action.bound,
            setP2pOrderList: action.bound,
            setParameters: action.bound,
            setPoiStatus: action.bound,
            setReviewPeriod: action.bound,
            setBlockUnblockUserError: action.bound,
            setIsAdvertiserBlocked: action.bound,
            setIsBlockUnblockUserLoading: action.bound,
            setIsBlockUserModalOpen: action.bound,
            setShouldShowRealName: action.bound,
            setShouldShowPopup: action.bound,
            setUserBlockedCount: action.bound,
            setUserBlockedUntil: action.bound,
            setWebsocketInit: action.bound,
            toggleNicknamePopup: action.bound,
            updateAdvertiserInfo: action.bound,
            updateP2pNotifications: action.bound,
        });
    }

    get client() {
        return { ...this.props?.client } || {};
    }

    get current_focus() {
        return this.props?.current_focus;
    }

    get setCurrentFocus() {
        return this.props?.setCurrentFocus;
    }

    get blocked_until_date_time() {
        return getFormattedDateString(new Date(convertToMillis(this.user_blocked_until)), false, true);
    }

    get is_active_tab() {
        return this.order_table_type === order_list.ACTIVE;
    }

    get is_barred() {
        return !!this.user_blocked_until;
    }

    get is_my_profile_tab_visible() {
        return this.is_advertiser && !this.root_store.my_profile_store.should_hide_my_profile_tab;
    }

    get should_show_dp2p_blocked() {
        return this.is_blocked || this.is_high_risk_fully_authed_without_fa;
    }

    blockUnblockUser(should_block, advertiser_id, should_set_is_counterparty_blocked = true) {
        const { advertiser_page_store } = this.root_store;
        this.setIsBlockUnblockUserLoading(true);
        requestWS({
            p2p_advertiser_relations: 1,
            [should_block ? 'add_blocked' : 'remove_blocked']: [advertiser_id],
        }).then(response => {
            if (response) {
                if (!response.error) {
                    this.setIsBlockUserModalOpen(false);
                    if (should_set_is_counterparty_blocked) {
                        const { p2p_advertiser_relations } = response;

                        //TODO: Remove this when backend has fixed is_blocked flag issue
                        this.setAdvertiserRelationsResponse(p2p_advertiser_relations.blocked_advertisers);

                        advertiser_page_store.setIsCounterpartyAdvertiserBlocked(
                            p2p_advertiser_relations.blocked_advertisers.some(ad => ad.id === advertiser_id)
                        );
                    }
                } else {
                    this.setBlockUnblockUserError(response.error.message);
                }
            }
            this.setIsBlockUnblockUserLoading(false);
        });
    }

    createAdvertiser(name) {
        requestWS({
            p2p_advertiser_create: 1,
            name,
        }).then(response => {
            const { sendbird_store, buy_sell_store } = this.root_store;
            const { error, p2p_advertiser_create } = response;
            const {
                daily_buy,
                daily_buy_limit,
                daily_sell,
                daily_sell_limit,
                id,
                is_approved,
                name: advertiser_name,
            } = p2p_advertiser_create || {};

            if (error) {
                this.setNicknameError(error.message);
            } else {
                this.setAdvertiserId(id);
                this.setAdvertiserInfo(p2p_advertiser_create);
                this.setAdvertiserBuyLimit(daily_buy_limit - daily_buy);
                this.setAdvertiserSellLimit(daily_sell_limit - daily_sell);
                this.setIsAdvertiser(!!is_approved);
                this.setNickname(advertiser_name);
                this.setNicknameError(undefined);
                sendbird_store.handleP2pAdvertiserInfo(response);
                this.toggleNicknamePopup();
                buy_sell_store.hideVerification();
            }
        });
    }

    getLocalStorageSettings = () => {
        return JSON.parse(localStorage.getItem('p2p_settings') || '{}');
    };

    getLocalStorageSettingsForLoginId() {
        const local_storage_settings = this.getLocalStorageSettings()[this.client.loginid];

        if (isEmptyObject(local_storage_settings)) {
            return { is_cached: false, notifications: [] };
        }

        return local_storage_settings;
    }

    getWebsiteStatus() {
        requestWS({ website_status: 1 }).then(response => {
            if (response && !response.error) {
                const { buy_sell_store } = this.root_store;
                const { p2p_config } = response.website_status;
                const { feature_level, local_currencies, review_period } = p2p_config || {};

                this.setFeatureLevel(feature_level);
                buy_sell_store.setLocalCurrencies(local_currencies);
                this.setReviewPeriod(review_period);
            }
        });
    }

    handleNotifications(old_orders, new_orders) {
        const { order_store } = this.root_store;
        const { client, props } = this;
        const { is_cached, notifications } = this.getLocalStorageSettingsForLoginId();

        new_orders.forEach(new_order => {
            const order_info = createExtendedOrderDetails(new_order, client.loginid, props.server_time);
            const notification = notifications.find(n => n.order_id === new_order.id);
            const old_order = old_orders.find(o => o.id === new_order.id);
            const is_current_order = new_order.id === order_store.order_id;
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

                        // Push notification for successful order completion
                        const { advertiser_details, client_details, id, status, type } = new_order;

                        if (
                            type === buy_sell.BUY &&
                            status === 'completed' &&
                            client_details.loginid === client.loginid
                        )
                            this.showCompletedOrderNotification(advertiser_details.name, id);

                        if (
                            type === buy_sell.SELL &&
                            status === 'completed' &&
                            advertiser_details.loginid === client.loginid
                        )
                            this.showCompletedOrderNotification(client_details.name, id);
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

    redirectToOrderDetails(order_id) {
        const { order_store } = this.root_store;
        this.redirectTo('orders');
        this.setOrderTableType(order_list.INACTIVE);
        order_store.setOrderId(order_id);
    }

    showCompletedOrderNotification(advertiser_name, order_id) {
        const { order_store } = this.root_store;
        const notification_key = `order-${order_id}`;

        // we need to refresh notifications in notifications-store in the case of a bug when user closes the notification, the notification count is not synced up with the closed notification
        this.props.refreshNotifications();

        this.props.addNotificationMessage({
            action: {
                onClick: () => {
                    if (order_store.order_id === order_id) {
                        order_store.setIsRatingModalOpen(true);
                    }
                    this.redirectToOrderDetails(order_id);
                },
                text: localize('Give feedback'),
            },
            header: <Localize i18n_default_text='Your order {{order_id}} is complete' values={{ order_id }} />,
            key: notification_key,
            message: (
                <Localize
                    i18n_default_text='{{name}} has released your funds. <br/> Would you like to give your feedback?'
                    values={{ name: advertiser_name }}
                />
            ),
            platform: 'P2P',
            type: 'p2p_completed_order',
        });
    }

    handleTabClick(idx) {
        this.setActiveIndex(idx);
        this.setParameters(null);
    }

    onMount() {
        this.setIsLoading(true);
        this.setIsBlocked(false);
        this.setIsHighRiskFullyAuthedWithoutFa(false);
        this.setIsP2pBlockedForPa(false);

        this.disposeUserBarredReaction = reaction(
            () => this.user_blocked_until,
            blocked_until => {
                if (typeof blocked_until === 'number') {
                    const server_time = this.props.server_time.get();
                    const blocked_until_moment = toMoment(blocked_until);

                    this.user_blocked_timeout = setTimeout(() => {
                        this.setUserBlockedUntil(null);
                    }, blocked_until_moment.diff(server_time));
                }
            }
        );

        requestWS({ get_account_status: 1 }).then(({ error, get_account_status }) => {
            const hasStatuses = statuses => statuses.every(status => get_account_status.status.includes(status));

            const is_blocked_for_pa = hasStatuses(['p2p_blocked_for_pa']);

            if (error) {
                this.setIsHighRiskFullyAuthedWithoutFa(false);
                this.setIsBlocked(false);
                this.setIsP2pBlockedForPa(false);
            } else if (get_account_status.risk_classification === 'high') {
                const is_cashier_locked = hasStatuses(['cashier_locked']);

                const is_fully_authenticated = hasStatuses(['age_verification', 'authenticated']);
                const is_not_fully_authenticated = !hasStatuses(['age_verification', 'authenticated']);

                const is_fully_authed_but_poi_expired = hasStatuses(['authenticated', 'document_expired']);
                const is_fully_authed_but_needs_fa =
                    is_fully_authenticated && hasStatuses(['financial_assessment_not_complete']);

                const is_not_fully_authenticated_and_fa_not_completed =
                    is_not_fully_authenticated && hasStatuses(['financial_assessment_not_complete']);

                if (is_fully_authed_but_needs_fa) {
                    // First priority: Send user to Financial Assessment if they have to submit it.
                    this.setIsHighRiskFullyAuthedWithoutFa(true);
                } else if (
                    is_cashier_locked ||
                    is_not_fully_authenticated ||
                    is_fully_authed_but_poi_expired ||
                    is_not_fully_authenticated_and_fa_not_completed
                ) {
                    // Second priority: If user is blocked, don't bother asking them to submit FA.
                    this.setIsBlocked(true);
                }
            }

            if (is_blocked_for_pa) {
                this.setIsP2pBlockedForPa(true);
            }

            this.setIsLoading(false);

            const { sendbird_store } = this.root_store;

            this.setP2PConfig();

            this.ws_subscriptions = {
                advertiser_subscription: subscribeWS(
                    {
                        p2p_advertiser_info: 1,
                        subscribe: 1,
                    },
                    [this.updateAdvertiserInfo, response => sendbird_store.handleP2pAdvertiserInfo(response)]
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
                exchange_rate_subscription: subscribeWS(
                    {
                        exchange_rates: 1,
                        base_currency: this.client.currency,
                        subscribe: 1,
                        target_currency:
                            this.root_store.buy_sell_store.selected_local_currency ??
                            this.client.local_currency_config?.currency,
                    },
                    [this.root_store.floating_rate_store.fetchExchangeRate]
                ),
            };

            this.disposeLocalCurrencyReaction = reaction(
                () => [this.root_store.buy_sell_store.local_currency, this.active_index],
                () => {
                    this.subscribeToLocalCurrency();
                }
            );

            if (this.ws_subscriptions) {
                this.setIsLoading(false);
            }
        });
    }

    subscribeToLocalCurrency() {
        const { floating_rate_store, buy_sell_store } = this.root_store;
        const client_currency = this.client.local_currency_config?.currency;

        this.ws_subscriptions?.exchange_rate_subscription?.unsubscribe?.();
        this.ws_subscriptions.exchange_rate_subscription = subscribeWS(
            {
                exchange_rates: 1,
                base_currency: this.client.currency,
                subscribe: 1,
                target_currency:
                    this.active_index > 0 ? client_currency : buy_sell_store.local_currency ?? client_currency,
            },
            [floating_rate_store.fetchExchangeRate]
        );
    }

    onUnmount() {
        clearTimeout(this.service_token_timeout);
        clearTimeout(this.user_blocked_timeout);

        Object.keys(this.ws_subscriptions).forEach(key => this.ws_subscriptions[key].unsubscribe());

        if (typeof this.disposeUserBarredReaction === 'function') {
            this.disposeUserBarredReaction();
        }

        if (typeof this.disposeLocalCurrencyReaction === 'function') {
            this.disposeLocalCurrencyReaction();
        }

        this.setActiveIndex(0);
        this.props.refreshNotifications();
        this.props.filterNotificationMessages();
    }

    onNicknamePopupClose() {
        this.setShouldShowPopup(false);
    }

    poiStatusText = status => {
        switch (status) {
            case 'pending':
            case 'rejected':
                return <Localize i18n_default_text='Check your verification status.' />;
            case 'none':
            default:
                return (
                    <Localize i18n_default_text='We’ll need you to upload your documents to verify your identity.' />
                );
            case 'verified':
                return <Localize i18n_default_text='Identity verification is complete.' />;
        }
    };

    redirectTo(path_name, params = null) {
        this.setActiveIndex(this.path[path_name]);
        this.setParameters(params);
    }

    setActiveIndex(active_index) {
        this.active_index = active_index;
    }

    setActiveNotificationCount(active_notification_count) {
        this.active_notification_count = active_notification_count;
    }

    setAccountBalance(value) {
        this.balance = value;
    }

    setAdvertiserId(advertiser_id) {
        this.advertiser_id = advertiser_id;
    }

    setAdvertiserInfo(advertiser_info) {
        this.advertiser_info = advertiser_info;
    }

    setAdvertiserBuyLimit(advertiser_buy_limit) {
        this.advertiser_buy_limit = advertiser_buy_limit;
    }

    setAdvertiserSellLimit(advertiser_sell_limit) {
        this.advertiser_sell_limit = advertiser_sell_limit;
    }

    setAppProps(props) {
        this.props = props;
    }

    //TODO: Remove this when backend has fixed is_blocked flag issue
    setAdvertiserRelationsResponse(advertiser_relations_response) {
        this.advertiser_relations_response = advertiser_relations_response;
    }

    setBlockUnblockUserError(block_unblock_user_error) {
        this.block_unblock_user_error = block_unblock_user_error;
    }

    setContactInfo(contact_info) {
        this.contact_info = contact_info;
    }

    setDefaultAdvertDescription(default_advert_description) {
        this.default_advert_description = default_advert_description;
    }

    setFeatureLevel(feature_level) {
        this.feature_level = feature_level;
    }

    setInactiveNotificationCount(inactive_notification_count) {
        this.inactive_notification_count = inactive_notification_count;
    }

    setIsAdvertiser(is_advertiser) {
        this.is_advertiser = is_advertiser;
    }

    setIsAdvertiserBlocked(is_advertiser_blocked) {
        this.is_advertiser_blocked = is_advertiser_blocked;
    }

    setIsBlocked(is_blocked) {
        this.is_blocked = is_blocked;
    }

    setIsBlockUserModalOpen(is_block_user_modal_open) {
        this.is_block_user_modal_open = is_block_user_modal_open;
    }

    setIsBlockUnblockUserLoading(is_block_unblock_user_loading) {
        this.is_block_unblock_user_loading = is_block_unblock_user_loading;
    }

    setIsHighRiskFullyAuthedWithoutFa(is_high_risk_fully_authed_without_fa) {
        this.is_high_risk_fully_authed_without_fa = is_high_risk_fully_authed_without_fa;
    }

    setIsListed(is_listed) {
        this.is_listed = is_listed;
    }

    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    setIsP2pBlockedForPa(is_p2p_blocked_for_pa) {
        this.is_p2p_blocked_for_pa = is_p2p_blocked_for_pa;
    }

    setIsRestricted(is_restricted) {
        this.is_restricted = is_restricted;
    }

    setIsModalOpen(is_modal_open) {
        this.is_modal_open = is_modal_open;
    }

    setNickname(nickname) {
        this.nickname = nickname;
    }

    setNicknameError(nickname_error) {
        this.nickname_error = nickname_error;
    }

    setNotificationCount(notification_count) {
        this.notification_count = notification_count;
    }

    setOrderTableType(order_table_type) {
        const { order_store } = this.root_store;
        order_store.setIsLoading(true);
        this.order_table_type = order_table_type;
    }

    setP2PConfig() {
        const { floating_rate_store } = this.root_store;
        requestWS({ website_status: 1 }).then(response => {
            if (!!response && response.error) {
                floating_rate_store.setApiErrorMessage(response.error.message);
            } else {
                const {
                    fixed_rate_adverts,
                    float_rate_adverts,
                    float_rate_offset_limit,
                    fixed_rate_adverts_end_date,
                    override_exchange_rate,
                } = response.website_status.p2p_config;
                floating_rate_store.setFixedRateAdvertStatus(fixed_rate_adverts);
                floating_rate_store.setFloatingRateAdvertStatus(float_rate_adverts);
                floating_rate_store.setFloatRateOffsetLimit(float_rate_offset_limit);
                floating_rate_store.setFixedRateAdvertsEndDate(fixed_rate_adverts_end_date || null);
                floating_rate_store.setApiErrorMessage(null);
                if (override_exchange_rate) floating_rate_store.setOverrideExchangeRate(override_exchange_rate);
            }
        });
    }

    setP2pOrderList(order_response) {
        if (order_response.error) {
            this.ws_subscriptions.order_list_subscription.unsubscribe();
            return;
        }

        const { p2p_order_list, p2p_order_info } = order_response;
        const { order_store } = this.root_store;

        if (p2p_order_list) {
            const { list } = p2p_order_list;
            // it's an array of orders from p2p_order_list
            this.handleNotifications(order_store.orders, list);
            list.forEach(order => order_store.syncOrder(order));
        } else if (p2p_order_info) {
            // it's a single order from p2p_order_info
            const idx_order_to_update = order_store.orders.findIndex(order => order.id === p2p_order_info.id);
            const updated_orders = [...order_store.orders];
            // if it's a new order, add it to the top of the list
            if (idx_order_to_update < 0) {
                updated_orders.unshift(p2p_order_info);
            } else {
                // otherwise, update the correct order
                updated_orders[idx_order_to_update] = p2p_order_info;
            }

            this.handleNotifications(order_store.orders, updated_orders);
            order_store.syncOrder(p2p_order_info);
        }
    }

    setParameters(parameters) {
        this.parameters = parameters;
    }

    setPaymentInfo(payment_info) {
        this.payment_info = payment_info;
    }

    setPoiStatus(poi_status) {
        this.poi_status = poi_status;
    }

    setReviewPeriod(review_period) {
        this.review_period = review_period;
    }

    setShouldShowRealName(should_show_real_name) {
        this.should_show_real_name = should_show_real_name;
    }

    setShouldShowPopup(should_show_popup) {
        this.should_show_popup = should_show_popup;
    }

    setUserBlockedCount(user_blocked_count) {
        this.user_blocked_count = user_blocked_count;
    }

    setUserBlockedUntil(user_blocked_until) {
        this.user_blocked_until = user_blocked_until;
    }

    setWebsocketInit = websocket => {
        WebsocketInit(websocket);
    };

    toggleNicknamePopup() {
        this.setShouldShowPopup(!this.should_show_popup);
        this.setNicknameError(undefined);
    }

    updateAdvertiserInfo(response) {
        const {
            blocked_by_count,
            blocked_until,
            contact_info,
            daily_buy,
            daily_buy_limit,
            daily_sell,
            daily_sell_limit,
            default_advert_description,
            id,
            is_approved,
            is_blocked,
            is_listed,
            name,
            payment_info,
            show_name,
        } = response?.p2p_advertiser_info || {};

        if (!response.error) {
            this.setAdvertiserId(id);
            this.setAdvertiserInfo(response.p2p_advertiser_info);
            this.setContactInfo(contact_info);
            this.setDefaultAdvertDescription(default_advert_description);
            this.setAdvertiserBuyLimit(daily_buy_limit - daily_buy);
            this.setAdvertiserSellLimit(daily_sell_limit - daily_sell);
            this.setIsAdvertiser(!!is_approved);
            this.setIsAdvertiserBlocked(!!is_blocked);
            this.setIsListed(!!is_listed);
            this.setNickname(name);
            this.setUserBlockedUntil(blocked_until);
            this.setUserBlockedCount(blocked_by_count);
            this.setPaymentInfo(payment_info);
            this.setShouldShowRealName(!!show_name);
        } else {
            this.ws_subscriptions.advertiser_subscription.unsubscribe();

            this.setContactInfo('');
            this.setPaymentInfo('');
            this.setDefaultAdvertDescription('');

            if (response.error.code === api_error_codes.RESTRICTED_COUNTRY) {
                this.setIsRestricted(true);
            } else if (response.error.code === api_error_codes.ADVERTISER_NOT_FOUND) {
                this.setIsAdvertiser(false);
            } else if (response.error.code === api_error_codes.PERMISSION_DENIED) {
                this.setIsBlocked(true);
                this.setIsLoading(false);
                return;
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

        this.setIsLoading(false);
    }

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

    validatePopup = values => {
        const validations = {
            nickname: [
                v => !!v,
                v => v.length >= 2,
                v => v.length <= 24,
                v => /^[a-zA-Z0-9\\.@_-]{2,24}$/.test(v),
                v => /^(?!(.*(.)\\2{4,})|.*[\\.@_-]{2,}|^([\\.@_-])|.*([\\.@_-])$)[a-zA-Z0-9\\.@_-]{2,24}$/.test(v),
                v => !/([a-zA-Z0-9\\.@_-])\1{4}/.test(v),
            ],
        };

        const nickname_messages = [
            localize('Nickname is required'),
            localize('Nickname is too short'),
            localize('Nickname is too long'),
            localize('Can only contain letters, numbers, and special characters .- _ @.'),
            localize('Cannot start, end with, or repeat special characters.'),
            localize('Cannot repeat a character more than 4 times.'),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => {
                return !v(values[key]);
            });

            if (error_index !== -1) {
                switch (key) {
                    case 'nickname':
                    default: {
                        errors[key] = nickname_messages[error_index];
                        break;
                    }
                }
            }
        });

        return errors;
    };
}
