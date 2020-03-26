import { action, observable } from 'mobx';
import ServerTime from '_common/base/server_time';
import { LocalStore } from '_common/storage';
import AppRoutes, { routing_control_key } from 'Constants/routes';
import { currentLanguage } from 'Utils/Language/index';
import BaseStore from './base-store';
import { clientNotifications } from './Helpers/client-notifications';

export default class CommonStore extends BaseStore {
    constructor(root_store) {
        super({ root_store });
        // Since we refresh the page on routing across bot, we need to identify
        // if launch was from bot so we can redirect back to bot as platform
        const routing_control_raw = LocalStore.get(routing_control_key);

        if (routing_control_raw) {
            const route_control = JSON.parse(routing_control_raw);

            if (route_control.is_from_bot) {
                this.addRouteHistoryItem({ pathname: AppRoutes.bot, action: 'PUSH' });
                delete route_control.is_from_bot;
                LocalStore.setObject(routing_control_key, route_control);
            }
        }
    }

    @observable server_time = ServerTime.get();
    @observable current_language = currentLanguage;
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

    @action.bound
    setServerTime(server_time) {
        this.server_time = server_time;
    }

    @action.bound
    setIsSocketOpened(is_socket_opened) {
        // note that it's not for account switch that we're doing this,
        // but rather to reset account related stores like portfolio and contract-trade
        const should_broadcast_account_change = this.was_socket_opened && !this.is_socket_opened && is_socket_opened;

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

        const ui_store = this.root_store.ui;
        if (!is_online) {
            ui_store.addNotificationMessage(clientNotifications().you_are_offline);
        } else {
            ui_store.removeNotificationMessage(clientNotifications().you_are_offline);
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
            }),
        };
    }

    @action.bound
    showError(message, header, redirect_label, redirectOnClick, should_show_refresh) {
        this.setError(true, {
            header,
            message,
            redirect_label,
            redirectOnClick,
            should_show_refresh,
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
    routeBackInApp(history) {
        let route_to_item_idx = -1;
        const route_to_item = this.app_routing_history.find((history_item, idx) => {
            const parent_path = history_item.pathname.split('/')[1];
            const platform_parent_paths = [AppRoutes.mt5, AppRoutes.bot, AppRoutes.trade].map(i => i.split('/')[1]); // map full path to just base path (`/mt5/abc` -> `mt5`)
            if (history_item.action === 'PUSH' && platform_parent_paths.includes(parent_path)) {
                route_to_item_idx = idx;
                return true;
            }
            return false;
        });

        if (route_to_item && route_to_item_idx > -1) {
            this.app_routing_history.splice(0, route_to_item_idx + 1);
            history.push(route_to_item.pathname);
        } else {
            history.push(AppRoutes.trade);
        }
    }
}
