import { getAppId, getUrlBinaryBot, getUrlSmartTrader, isMobile, platforms, routes, toMoment } from '@deriv/shared';
import { getAllowedLanguages } from '@deriv/translations';
import { action, computed, observable } from 'mobx';
import { currentLanguage } from 'Utils/Language/index';
import ServerTime from '_common/base/server_time';
import BinarySocket from '_common/base/socket_base';
import BaseStore from './base-store';

export default class CommonStore extends BaseStore {
    constructor(root_store) {
        super({ root_store });
    }

    @observable server_time = ServerTime.get() || toMoment(); // fallback: get current time from moment.js
    @observable current_language = currentLanguage;
    @observable is_language_changing = false;
    @observable allowed_languages = Object.keys(getAllowedLanguages());
    @observable has_error = false;

    @observable error = {
        type: 'info',
        message: '',
    };

    @observable network_status = {};
    @observable is_network_online = false;
    @observable is_socket_opened = false;
    @observable was_socket_opened = false;

    @observable services_error = {};

    @observable deposit_url = '';
    @observable withdraw_url = '';

    @observable app_routing_history = [];
    @observable app_router = { history: null };
    @observable app_id = undefined;
    @observable platform = '';
    @observable selected_contract_type = '';

    @observable changing_language_timer_id = '';

    @action.bound
    setSelectedContractType(contract_type) {
        this.selected_contract_type = contract_type;
    }

    @action.bound
    init() {
        this.setPlatform();
    }

    @action.bound
    checkAppId() {
        if (this.app_id && this.app_id !== getAppId()) {
            BinarySocket.closeAndOpenNewConnection();
        }
        this.app_id = getAppId();
    }

    @action.bound
    changeCurrentLanguage(new_language) {
        if (this.current_language !== new_language) {
            if (this.changing_language_timer_id) clearTimeout(this.changing_language_timer_id);
            this.current_language = new_language;
            this.is_language_changing = true;
            this.changing_language_timer_id = setTimeout(() => {
                this.is_language_changing = false;
            }, 10000);
        }
    }

    @action.bound
    setPlatform() {
        const search = window.location.search;
        if (search) {
            const url_params = new URLSearchParams(search);
            this.platform = url_params.get('platform') || '';
        }
    }

    @computed
    get is_from_derivgo() {
        return platforms[this.platform]?.platform_name === platforms.derivgo.platform_name;
    }

    @action.bound
    setInitialRouteHistoryItem(location) {
        if (window.location.href.indexOf('?ext_platform_url=') !== -1) {
            const ext_url = decodeURI(new URL(window.location.href).searchParams.get('ext_platform_url'));

            if (ext_url?.indexOf(getUrlSmartTrader()) === 0) {
                this.addRouteHistoryItem({ pathname: ext_url, action: 'PUSH', is_external: true });
            } else if (ext_url?.indexOf(routes.cashier_p2p) === 0) {
                this.addRouteHistoryItem({ pathname: ext_url, action: 'PUSH' });
            } else if (ext_url?.indexOf(getUrlBinaryBot()) === 0) {
                this.addRouteHistoryItem({ pathname: ext_url, action: 'PUSH', is_external: true });
            } else {
                this.addRouteHistoryItem({ ...location, action: 'PUSH' });
            }

            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            this.addRouteHistoryItem({ ...location, action: 'PUSH' });
        }
    }

    @action.bound
    setServerTime(server_time) {
        this.server_time = server_time;
    }

    @action.bound
    setIsSocketOpened(is_socket_opened) {
        // note that it's not for account switch that we're doing this,
        // but rather to reset account related stores like portfolio and contract-trade
        const should_broadcast_account_change = this.was_socket_opened && is_socket_opened;

        this.is_socket_opened = is_socket_opened;
        this.was_socket_opened = this.was_socket_opened || is_socket_opened;

        if (should_broadcast_account_change) {
            this.root_store.client.broadcastAccountChangeAfterAuthorize();
        }
    }

    @action.bound
    setNetworkStatus(status, is_online) {
        if (this.network_status.class) {
            this.network_status.class = status.class;
            this.network_status.tooltip = status.tooltip;
        } else {
            this.network_status = status;
        }
        this.is_network_online = is_online;

        const { addNotificationMessage, client_notifications, removeNotificationMessage } =
            this.root_store.notifications;
        if (!is_online) {
            addNotificationMessage(client_notifications.you_are_offline);
        } else {
            removeNotificationMessage(client_notifications.you_are_offline);
        }
    }

    @action.bound
    setError(has_error, error) {
        this.has_error = has_error;
        this.error = {
            type: error ? error.type : 'info',
            ...(error && {
                header: error.header,
                message: error.message,
                redirect_label: error.redirect_label,
                redirectOnClick: error.redirectOnClick,
                should_show_refresh: error.should_show_refresh,
                redirect_to: error.redirect_to,
                should_clear_error_on_click: error.should_clear_error_on_click,
                setError: this.setError,
            }),
        };
    }

    @action.bound
    showError({
        message,
        header,
        redirect_label,
        redirectOnClick,
        should_show_refresh,
        redirect_to,
        should_clear_error_on_click,
    }) {
        this.setError(true, {
            header,
            message,
            redirect_label,
            redirectOnClick,
            should_show_refresh,
            redirect_to,
            should_clear_error_on_click,
            type: 'error',
        });
    }

    @action.bound
    setDepositURL(deposit_url) {
        this.deposit_url = deposit_url;
    }

    @action.bound
    setWithdrawURL(withdraw_url) {
        this.withdraw_url = withdraw_url;
    }

    @action.bound
    setServicesError(error) {
        this.services_error = error;
        if (isMobile()) {
            if (error.code === 'CompanyWideLimitExceeded') {
                this.root_store.ui.toggleServicesErrorModal(true);
            } else {
                this.root_store.ui.addToast({
                    content: error.message,
                    type: 'error',
                });
            }
        } else {
            this.root_store.ui.toggleServicesErrorModal(true);
        }
    }

    @action.bound
    setAppRouterHistory(history) {
        this.app_router.history = history;
    }

    @action.bound
    routeTo(pathname) {
        if (this.app_router.history) this.app_router.history.push(pathname);
    }

    @action.bound
    addRouteHistoryItem(router_action) {
        const check_existing = this.app_routing_history.findIndex(
            i => i.pathname === router_action.pathname && i.action === 'PUSH'
        );
        if (check_existing > -1) {
            this.app_routing_history.splice(check_existing, 1);
        }
        this.app_routing_history.unshift(router_action);
    }

    @action.bound
    routeBackInApp(history, additional_platform_path = []) {
        let route_to_item_idx = -1;
        const route_to_item = this.app_routing_history.find((history_item, idx) => {
            if (history_item.action === 'PUSH') {
                if (history_item.is_external) {
                    return true;
                }

                const parent_path = history_item.pathname.split('/')[1];
                const platform_parent_paths = [routes.mt5, routes.bot, routes.trade, routes.dxtrade].map(
                    i => i.split('/')[1]
                ); // map full path to just base path (`/mt5/abc` -> `mt5`)

                if (
                    platform_parent_paths.includes(parent_path) ||
                    additional_platform_path.includes(history_item.pathname)
                ) {
                    route_to_item_idx = idx;
                    return true;
                }
            }

            return false;
        });

        if (route_to_item) {
            if (route_to_item.is_external) {
                window.location.href = route_to_item.pathname;
                return;
            } else if (route_to_item_idx > -1) {
                this.app_routing_history.splice(0, route_to_item_idx + 1);
                // remove once p2p is ready
                const ui_store = this.root_store.ui;
                if (route_to_item.pathname === routes.cashier_p2p && ui_store.is_mobile)
                    history.push(`${route_to_item.pathname}/verification`);
                else history.push(route_to_item.pathname);
                return;
            }
        }

        history.push(routes.trade);
    }
}
