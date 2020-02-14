import { action, observable } from 'mobx';
import moment from 'moment';
import { LocalStore } from '_common/storage';
import AppRoutes, { routing_control_key } from 'Constants/routes';
import { currentLanguage } from 'Utils/Language/index';
import BaseStore from './base-store';
import { clientNotifications } from './Helpers/client-notifications';

export default class CommonStore extends BaseStore {
    constructor(root_store) {
        super({ root_store });
        const routing_control_raw = LocalStore.get(routing_control_key);

        if (routing_control_raw) {
            const route_control = JSON.parse(routing_control_raw);

            if (route_control.is_from_bot) {
                this.setRoutedInternally(true);
                delete route_control.is_from_bot;
                LocalStore.setObject(routing_control_key, route_control);
            }
        }
    }

    @observable server_time = moment.utc();
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

    @observable has_routed_internally = false;

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
    setRoutedInternally(has_routed_internally) {
        this.has_routed_internally = has_routed_internally;
    }

    @action.bound
    routeBackInApp(history) {
        if (this.has_routed_internally) {
            history.goBack();
        } else {
            history.push(AppRoutes.trade);
        }
    }
}
