import * as SocketCache from '_common/base/socket_cache';
import { action, computed, makeObservable, observable } from 'mobx';
import { changeLanguage, getAllowedLanguages } from '@deriv/translations';
import { getAppId, getUrlBinaryBot, getUrlSmartTrader, isMobile, platforms, routes, toMoment } from '@deriv/shared';
import BaseStore from './base-store';
import BinarySocket from '_common/base/socket_base';
import ServerTime from '_common/base/server_time';
import WS from 'Services/ws-methods';
import { currentLanguage } from 'Utils/Language/index';

export default class CommonStore extends BaseStore {
    constructor(root_store) {
        super({ root_store });

        makeObservable(this, {
            server_time: observable,
            current_language: observable,
            is_language_changing: observable,
            allowed_languages: observable,
            has_error: observable,
            error: observable,
            network_status: observable,
            is_network_online: observable,
            is_socket_opened: observable,
            was_socket_opened: observable,
            services_error: observable,
            deposit_url: observable,
            withdraw_url: observable,
            app_routing_history: observable,
            app_router: observable,
            app_id: observable,
            platform: observable,
            selected_contract_type: observable,
            changing_language_timer_id: observable,
            setSelectedContractType: action.bound,
            init: action.bound,
            checkAppId: action.bound,
            changeCurrentLanguage: action.bound,
            setAppstorePlatform: action.bound,
            setPlatform: action.bound,
            is_from_derivgo: computed,
            setInitialRouteHistoryItem: action.bound,
            setServerTime: action.bound,
            setIsSocketOpened: action.bound,
            setNetworkStatus: action.bound,
            setError: action.bound,
            showError: action.bound,
            setDepositURL: action.bound,
            setWithdrawURL: action.bound,
            setServicesError: action.bound,
            setAppRouterHistory: action.bound,
            routeTo: action.bound,
            addRouteHistoryItem: action.bound,
            changeSelectedLanguage: action.bound,
            getExchangeRate: action.bound,
            routeBackInApp: action.bound,
        });
    }

    server_time = ServerTime.get() || toMoment(); // fallback: get current time from moment.js
    current_language = currentLanguage;
    is_language_changing = false;
    allowed_languages = Object.keys(getAllowedLanguages());
    has_error = false;

    error = {
        type: 'info',
        message: '',
    };

    network_status = {};
    is_network_online = false;
    is_socket_opened = false;
    was_socket_opened = false;

    services_error = {};

    deposit_url = '';
    withdraw_url = '';

    app_routing_history = [];
    app_router = { history: null };
    app_id = undefined;
    platform = '';
    selected_contract_type = '';

    changing_language_timer_id = '';

    setSelectedContractType(contract_type) {
        this.selected_contract_type = contract_type;
    }

    init() {
        this.setPlatform();
    }

    checkAppId() {
        if (this.app_id && this.app_id !== getAppId()) {
            BinarySocket.closeAndOpenNewConnection();
        }
        this.app_id = getAppId();
    }

    changeCurrentLanguage(new_language) {
        if (this.current_language !== new_language) {
            if (this.changing_language_timer_id) clearTimeout(this.changing_language_timer_id);
            this.current_language = new_language;
            this.is_language_changing = true;
            this.changing_language_timer_id = setTimeout(() => {
                this.is_language_changing = false;
            }, 2500);
        }
    }

    changeSelectedLanguage = async key => {
        SocketCache.clear();
        if (key === 'EN') {
            window.localStorage.setItem('i18n_language', key);
        }
        await WS.wait('authorize');
        return new Promise((resolve, reject) => {
            WS.setSettings({
                set_settings: 1,
                preferred_language: key,
            }).then(async () => {
                const new_url = new URL(window.location.href);
                if (key === 'EN') {
                    new_url.searchParams.delete('lang');
                } else {
                    new_url.searchParams.set('lang', key);
                }
                window.history.pushState({ path: new_url.toString() }, '', new_url.toString());
                try {
                    await changeLanguage(key, () => {
                        this.changeCurrentLanguage(key);
                        BinarySocket.closeAndOpenNewConnection(key);
                        this.root_store.client.setIsAuthorize(false);
                    });
                    resolve();
                } catch (e) {
                    reject();
                }
            });
        });
    };

    setAppstorePlatform(platform) {
        this.platform = platform;
    }

    setPlatform() {
        const search = window.location.search;
        if (search) {
            const url_params = new URLSearchParams(search);
            const platform = url_params.get('platform');
            if (platform) {
                this.platform = platform;
                localStorage.setItem('config.platform', this.platform);
            }
        }
    }

    get is_from_derivgo() {
        return platforms[this.platform]?.platform_name === platforms.derivgo.platform_name;
    }

    setInitialRouteHistoryItem(location) {
        if (window.location.href.indexOf('?ext_platform_url=') !== -1) {
            const ext_url = decodeURI(new URL(window.location.href).searchParams.get('ext_platform_url'));
            const { setExternalParams } = this.root_store.client;
            setExternalParams({
                url: ext_url,
                should_redirect: true,
            });
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

    setServerTime(server_time) {
        this.server_time = server_time;
    }

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

    setDepositURL(deposit_url) {
        this.deposit_url = deposit_url;
    }

    setWithdrawURL(withdraw_url) {
        this.withdraw_url = withdraw_url;
    }

    setServicesError(error) {
        this.services_error = error;
        if (isMobile()) {
            if (error.code === 'CompanyWideLimitExceeded' || error.code === 'PleaseAuthenticate') {
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

    setAppRouterHistory(history) {
        this.app_router.history = history;
    }

    routeTo(pathname) {
        if (this.app_router.history) this.app_router.history.push(pathname);
    }

    addRouteHistoryItem(router_action) {
        const check_existing = this.app_routing_history.findIndex(
            i => i.pathname === router_action.pathname && i.action === 'PUSH'
        );
        if (check_existing > -1) {
            this.app_routing_history.splice(check_existing, 1);
        }
        this.app_routing_history.unshift(router_action);
    }

    isCurrentLanguage = lang => lang === this.current_language;

    getExchangeRate = async (from_currency, to_currency) => {
        const { exchange_rates } = await BinarySocket.exchange_rates(from_currency);

        return exchange_rates?.rates?.[to_currency];
    };

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
