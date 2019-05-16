import {
    action,
    autorun,
    computed,
    observable }       from 'mobx';
import {
    MAX_MOBILE_WIDTH,
    MAX_TABLET_WIDTH } from 'Constants/ui';
import { unique }      from '_common/utility';
import BaseStore       from './base-store';

const store_name = 'ui_store';

export default class UIStore extends BaseStore {
    @observable is_main_drawer_on          = false;
    @observable is_notifications_drawer_on = false;
    @observable is_positions_drawer_on     = false;

    @observable is_dark_mode_on         = true;
    @observable is_language_dialog_on   = false;
    @observable is_settings_dialog_on   = false;
    @observable is_accounts_switcher_on = false;

    @observable has_only_forward_starting_contracts = false;

    // Purchase Controls
    // @observable is_purchase_confirm_on    = false;
    @observable is_services_error_visible = false;
    // @observable is_purchase_lock_on       = false;

    // SmartCharts Controls
    @observable is_chart_asset_info_visible = true;
    @observable is_chart_countdown_visible  = false;
    @observable is_chart_layout_default     = true;

    // PWA event and config
    @observable pwa_prompt_event = null;

    @observable screen_width = window.innerWidth;

    @observable push_notifications = [];
    @observable toast_messages = [];

    @observable is_advanced_duration   = false;
    @observable advanced_duration_unit = 't';
    @observable advanced_expiry_type   = 'duration';
    @observable simple_duration_unit   = 't';
    @observable duration_t             = 5;
    @observable duration_s             = 15;
    @observable duration_m             = 3;
    @observable duration_h             = 1;
    @observable duration_d             = 1;

    @observable is_fully_blurred = false;
    @observable is_app_blurred   = false;

    getDurationFromUnit = (unit) => this[`duration_${unit}`];

    constructor() {
        const local_storage_properties = [
            'advanced_duration_unit',
            'is_advanced_duration',
            'advanced_expiry_type',
            'simple_duration_unit',
            'duration_t',
            'duration_s',
            'duration_m',
            'duration_h',
            'duration_d',
            'is_chart_asset_info_visible',
            'is_chart_countdown_visible',
            'is_chart_layout_default',
            'is_dark_mode_on',
            'is_positions_drawer_on',
            // 'is_purchase_confirm_on',
            // 'is_purchase_lock_on',
        ];

        super({ local_storage_properties, store_name });
        window.addEventListener('resize', this.handleResize);
        autorun(() => {
            if (this.is_dark_mode_on) {
                document.body.classList.remove('theme--light');
                document.body.classList.add('theme--dark');
            } else {
                document.body.classList.remove('theme--dark');
                document.body.classList.add('theme--light');
            }
        });
    }

    @action.bound
    onChangeUiStore({ name, value }) {
        if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }
        this[name] = value;
    }

    @action.bound
    handleResize() {
        this.screen_width = window.innerWidth;
        if (this.is_mobile) {
            this.is_positions_drawer_on = false;
        }
    }

    @computed
    get is_mobile() {
        return this.screen_width <= MAX_MOBILE_WIDTH;
    }

    @computed
    get is_tablet() {
        return this.screen_width <= MAX_TABLET_WIDTH;
    }

    @action.bound
    showAppBlur() {
        this.is_app_blurred = true;
    }

    @action.bound
    hideAppBlur() {
        this.is_app_blurred = false;
    }

    @action.bound
    showFullBlur() {
        this.is_fully_blurred = true;
    }

    @action.bound
    hideFullBlur() {
        this.is_fully_blurred = false;
    }

    @action.bound
    toggleAccountsDialog() {
        this.is_accounts_switcher_on = !this.is_accounts_switcher_on;
    }

    @action.bound
    toggleChartLayout() {
        this.is_chart_layout_default = !this.is_chart_layout_default;
    }

    @action.bound
    toggleChartAssetInfo() {
        this.is_chart_asset_info_visible = !this.is_chart_asset_info_visible;
    }

    @action.bound
    toggleChartCountdown() {
        this.is_chart_countdown_visible = !this.is_chart_countdown_visible;
    }

    // @action.bound
    // togglePurchaseLock() {
    //     this.is_purchase_lock_on = !this.is_purchase_lock_on;
    // }

    // @action.bound
    // togglePurchaseConfirmation() {
    //     this.is_purchase_confirm_on = !this.is_purchase_confirm_on;
    // }

    @action.bound
    toggleDarkMode() {
        this.is_dark_mode_on = !this.is_dark_mode_on;
        return this.is_dark_mode_on;
    }

    @action.bound
    toggleSettingsDialog() {
        this.is_settings_dialog_on = !this.is_settings_dialog_on;
        if (!this.is_settings_dialog_on) this.is_language_dialog_on = false;
    }

    @action.bound
    showLanguageDialog() {
        this.is_language_dialog_on = true;
    }

    @action.bound
    hideLanguageDialog() {
        this.is_language_dialog_on = false;
    }

    @action.bound
    openPositionsDrawer() { // show and hide Positions Drawer
        this.is_positions_drawer_on = true;
    }

    @action.bound
    togglePositionsDrawer() { // toggle Positions Drawer
        this.is_positions_drawer_on = !this.is_positions_drawer_on;
    }

    @action.bound
    toggleServicesErrorModal(is_visible) {
        this.is_services_error_visible = is_visible;
    }

    @action.bound
    showMainDrawer() { // show main Drawer
        this.is_main_drawer_on = true;
    }

    @action.bound
    showNotificationsDrawer() { // show nofitications Drawer
        this.is_notifications_drawer_on = true;
    }

    @action.bound
    hideDrawers() { // hide both menu drawers
        this.is_main_drawer_on = false;
        this.is_notifications_drawer_on = false;
    }

    @action.bound
    removePWAPromptEvent() {
        this.pwa_prompt_event = null;
    }

    @action.bound
    setPWAPromptEvent(e) {
        this.pwa_prompt_event = e;
    }

    @action.bound
    addToastMessage(toast_message) {
        this.toast_messages.push(toast_message);
    }

    @action.bound
    removeToastMessage(toast_message) {
        const index = this.toast_messages.indexOf(toast_message);
        if (index > -1) {
            this.toast_messages.splice(index, 1);
        }
    }

    @action.bound
    removeAllToastMessages() {
        this.toast_messages = [];
    }

    @action.bound
    setHasOnlyForwardingContracts(has_only_forward_starting_contracts) {
        this.has_only_forward_starting_contracts = has_only_forward_starting_contracts;
    }

    @action.bound
    addNotificationBar(message) {
        this.push_notifications.push(message);
        this.push_notifications = unique(this.push_notifications, 'msg_type');
    }
}
