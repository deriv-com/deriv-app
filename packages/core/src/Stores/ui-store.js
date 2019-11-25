import {
    action,
    autorun,
    computed,
    observable }             from 'mobx';
import ObjectUtils           from 'deriv-shared/utils/object';
import {
    MAX_MOBILE_WIDTH,
    MAX_TABLET_WIDTH }       from 'Constants/ui';
import { LocalStore }        from '_common/storage';
import { sortNotifications } from 'App/Components/Elements/NotificationMessage';
import { isBot }             from 'Utils/PlatformSwitcher';
import {
    clientNotifications,
    excluded_notifications } from './Helpers/client-notifications';
import BaseStore             from './base-store';

const store_name = 'ui_store';

export default class UIStore extends BaseStore {
    @observable is_account_settings_visible = false;
    @observable is_main_drawer_on           = false;
    @observable is_notifications_visible    = false;
    @observable is_positions_drawer_on      = false;
    @observable is_reports_visible          = false;

    // Extensions
    @observable footer_extension         = undefined;
    @observable settings_extension       = undefined;
    @observable notification_messages_ui = undefined;

    @observable is_cashier_modal_on     = false;
    @observable is_dark_mode_on         = false;
    @observable is_settings_modal_on    = false;
    @observable is_accounts_switcher_on = false;

    @observable has_only_forward_starting_contracts = false;

    // Purchase Controls
    // @observable is_purchase_confirm_on    = false;
    @observable is_services_error_visible             = false;
    @observable is_unsupported_contract_modal_visible = false;
    @observable is_account_signup_modal_visible       = false;
    @observable is_set_residence_modal_visible        = false;
    @observable is_reset_password_modal_visible       = false;
    // @observable is_purchase_lock_on       = false;

    // SmartCharts Controls
    // TODO: enable asset information
    // @observable is_chart_asset_info_visible = true;
    @observable is_chart_countdown_visible = false;
    @observable is_chart_layout_default    = true;

    // PWA event and config
    @observable pwa_prompt_event = null;

    @observable screen_width = window.innerWidth;

    @observable notifications         = [];
    @observable notification_messages = [];
    @observable marked_notifications  = [];
    @observable push_notifications    = [];

    @observable is_advanced_duration   = false;
    @observable advanced_duration_unit = 't';
    @observable advanced_expiry_type   = 'duration';
    @observable simple_duration_unit   = 't';
    @observable duration_t             = 5;
    @observable duration_s             = 15;
    @observable duration_m             = 3;
    @observable duration_h             = 1;
    @observable duration_d             = 1;

    // purchase button states
    @observable purchase_states = [ false, false ];

    // app states for modal
    @observable is_app_disabled   = false;
    @observable is_route_modal_on = false;

    // real account signup
    @observable is_real_acc_signup_on         = false;
    @observable has_real_account_signup_ended = false;

    // position states
    @observable show_positions_toggle = true;

    @observable active_cashier_tab = 'deposit';
    @observable modal_index        = 0;

    // Mt5 topup
    @observable is_top_up_virtual_open = false;
    @observable is_top_up_virtual_success = false;

    // Real account signup
    @observable real_account_signup = {
        active_modal_index: -1,
        previous_currency : '',
        current_currency  : '',
        success_message   : '',
        error_message     : '',
    };

    getDurationFromUnit = (unit) => this[`duration_${unit}`];

    constructor(root_store) {
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
            'is_account_settings_visible',
            'is_chart_asset_info_visible',
            'is_chart_countdown_visible',
            'is_chart_layout_default',
            'is_dark_mode_on',
            'is_positions_drawer_on',
            'is_reports_visible',
            // 'is_purchase_confirm_on',
            // 'is_purchase_lock_on',
        ];

        super({ root_store, local_storage_properties, store_name });
        window.addEventListener('resize', this.handleResize);
        autorun(() => {
            // TODO: [disable-dark-bot] Delete this condition when Bot is ready
            if (isBot()) {
                document.body.classList.remove('theme--dark');
                document.body.classList.add('theme--light');
            } else if (this.is_dark_mode_on) {
                document.body.classList.remove('theme--light');
                document.body.classList.add('theme--dark');
            } else {
                document.body.classList.remove('theme--dark');
                document.body.classList.add('theme--light');
            }
        });
    }

    @action.bound
    init(notification_messages) {
        this.notification_messages_ui = notification_messages;
    }

    @action.bound
    populateFooterExtensions(component) {
        this.footer_extension = component;
    }

    @action.bound
    populateSettingsExtensions(menu_items) {
        this.settings_extension = menu_items;
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
    setRouteModal() {
        this.is_route_modal_on = true;
    }

    @action.bound
    disableRouteModal() {
        this.is_route_modal_on = false;
    }

    @action.bound
    disableApp() {
        this.is_app_disabled = true;
    }

    @action.bound
    enableApp() {
        this.is_app_disabled = false;
    }

    @action.bound
    toggleAccountsDialog() {
        this.is_accounts_switcher_on = !this.is_accounts_switcher_on;
    }

    @action.bound
    setPurchaseState(index) {
        this.purchase_states[index] = true;

        // TODO: Find better solution in the future for hack below
        // Force the animation to start quicker by manually assigning class to compensate for mobx getter lag
        // Because mobx has a delay before it can receive the updated prop used to assign the animation class
        const el_purchase_buttons = document.getElementsByClassName('btn-purchase');
        if (el_purchase_buttons[index]) {
            el_purchase_buttons[index].classList.add('btn-purchase--swoosh');
        }
        // UI/UX wants button to remain green until transition is finished and only then disable buttons
        setTimeout(() => {
            [].forEach.bind(el_purchase_buttons, (el) => {
                el.classList.add('btn-purchase--disabled');
            })();
        }, 250);
    }

    @action.bound
    resetPurchaseStates() {
        this.purchase_states = [ false, false ];
    }

    @action.bound
    setChartLayout(is_default) {
        this.is_chart_layout_default = is_default;
    }

    // TODO: enable asset information
    // @action.bound
    // setChartAssetInfo(is_visible) {
    //     this.is_chart_asset_info_visible = is_visible;
    // }

    @action.bound
    setChartCountdown(is_visible) {
        this.is_chart_countdown_visible = is_visible;
    }

    // @action.bound
    // togglePurchaseLock() {
    //     this.is_purchase_lock_on = !this.is_purchase_lock_on;
    // }

    // @action.bound
    // setPurchaseLock(is_locked) {
    //     this.is_purchase_lock_on = is_locked;
    // }

    // @action.bound
    // togglePurchaseConfirmation() {
    //     this.is_purchase_confirm_on = !this.is_purchase_confirm_on;
    // }

    @action.bound
    setDarkMode(is_dark_mode_on) {
        if (this.is_dark_mode_on !== is_dark_mode_on) {
            this.is_dark_mode_on = is_dark_mode_on;
            // This GTM call is here instead of the GTM store due to frequency of use
            this.root_store.gtm.pushDataLayer({ event: 'switch theme' });
        }

        return this.is_dark_mode_on;
    }

    @action.bound
    toggleCashierModal() {
        this.is_cashier_modal_on = !this.is_cashier_modal_on;
    }

    @action.bound
    setCashierActiveTab(tab = 'deposit') {
        if (this.active_cashier_tab !== tab) this.active_cashier_tab = tab;
    }

    @action.bound
    setModalIndex(index = 0) {
        this.modal_index = index;
    }

    @action.bound
    toggleSettingsModal() {
        this.is_settings_modal_on = !this.is_settings_modal_on;
    }

    @action.bound
    openPositionsDrawer() { // show and hide Positions Drawer
        this.is_positions_drawer_on = true;
    }

    @action.bound
    openRealAccountSignup() {
        this.is_real_acc_signup_on = true;
        this.is_accounts_switcher_on = false;
    }

    @action.bound
    closeRealAccountSignup() {
        this.is_real_acc_signup_on = false;
        setTimeout(() => {
            this.resetRealAccountSignupParams();
            this.setRealAccountSignupEnd(true);
        }, 300);
    }

    @action.bound
    closeSignupAndOpenCashier(active_tab = 'deposit') {
        this.is_real_acc_signup_on = false;
        this.setCashierActiveTab(active_tab);
        this.closeRealAccountSignup();
        // TODO enable this one cashier is active
        setTimeout(this.toggleCashierModal, 300);
    }

    @action.bound
    togglePositionsDrawer() { // toggle Positions Drawer
        this.is_positions_drawer_on = !this.is_positions_drawer_on;
    }

    @action.bound
    toggleNotificationsModal() {
        this.is_notifications_visible = !this.is_notifications_visible;
    }

    @action.bound
    toggleAccountSettings(is_visible) {
        this.is_account_settings_visible = is_visible;
    }

    @action.bound
    toggleReports(is_visible) {
        this.is_reports_visible = is_visible;
    }

    @action.bound
    toggleServicesErrorModal(is_visible) {
        this.is_services_error_visible = is_visible;
    }

    @action.bound
    showMainDrawer() {
        this.is_main_drawer_on = true;
    }

    @action.bound
    hideDrawers() {
        this.is_main_drawer_on = false;
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
    updateNotifications(notifications_array) {
        this.notifications =
            notifications_array.filter((message) => !excluded_notifications.includes(message.key));
    }

    @action.bound
    removeNotifications() {
        this.notifications = [];
    }

    @action.bound
    removeNotificationByKey({ key }) {
        this.notifications = this.notifications
            .filter(n => n.key !== key);
    }

    @action.bound
    addNotificationMessageByKey(key) {
        if (key) this.addNotificationMessage(clientNotifications()[key]);
    }

    @action.bound
    markNotificationMessage({ key }) {
        this.marked_notifications.push(key);
    }

    @action.bound
    addNotificationMessage(notification) {
        if (!this.notification_messages.find(item => item.header === notification.header)) {
            this.notification_messages = [...this.notification_messages, notification].sort(sortNotifications);
            if (!excluded_notifications.includes(notification.key)) {
                this.updateNotifications(this.notification_messages);
            }
            // Remove notification messages if it was already closed by user and exists in LocalStore
            const active_loginid = LocalStore.get('active_loginid');
            const messages       = LocalStore.getObject('notification_messages');
            if (active_loginid && !ObjectUtils.isEmptyObject(messages)) {
                // Check if is existing message to remove already closed messages stored in LocalStore
                const is_existing_message = Array.isArray(messages[active_loginid]) ?
                    messages[active_loginid].includes(notification.key) : false;
                if (is_existing_message) {
                    this.markNotificationMessage({ key: notification.key });
                }
            }
        }
    }

    @action.bound
    removeNotificationMessage({ key }) {
        this.notification_messages = this.notification_messages
            .filter(n => n.key !== key);
        // Add notification messages to LocalStore when user closes, check for redundancy
        const active_loginid = LocalStore.get('active_loginid');
        if (!excluded_notifications.includes(key) && active_loginid) {
            const messages = LocalStore.getObject('notification_messages');
            // Check if same message already exists in LocalStore for this account
            if (messages[active_loginid] && messages[active_loginid].includes(key)) {
                return;
            }
            const current_message = () => {
                if (Array.isArray(messages[active_loginid])) {
                    messages[active_loginid].push(key);
                    return messages[active_loginid];
                }
                return [key];
            };
            // Store message into LocalStore upon closing message
            Object.assign(messages, { [active_loginid]: current_message() });
            LocalStore.setObject('notification_messages', messages);
        }
    }

    @action.bound
    removeAllNotificationMessages() {
        this.notification_messages = [];
    }

    @action.bound
    setHasOnlyForwardingContracts(has_only_forward_starting_contracts) {
        this.has_only_forward_starting_contracts = has_only_forward_starting_contracts;
    }

    @action.bound
    addNotificationBar(message) {
        this.push_notifications.push(message);
        this.push_notifications = ObjectUtils.unique(this.push_notifications, 'msg_type');
    }

    @action.bound
    toggleUnsupportedContractModal(state_change = !this.is_unsupported_contract_modal_visible) {
        this.is_unsupported_contract_modal_visible = state_change;
    }

    @action.bound
    toggleAccountSignupModal(state_change = !this.is_account_signup_modal_visible) {
        this.is_account_signup_modal_visible = state_change;
    }

    @action.bound
    toggleSetResidenceModal(state_change = !this.is_set_residence_modal_visible) {
        this.is_set_residence_modal_visible = state_change;
    }

    @action.bound
    closeTopUpModal() {
        this.is_top_up_virtual_open = false;
    }

    @action.bound
    openTopUpModal() {
        this.is_top_up_virtual_open = true;
    }

    @action.bound
    closeSuccessTopUpModal () {
        this.is_top_up_virtual_success = false;
    }

    @action.bound
    toggleResetPasswordModal(state_change = !this.is_reset_password_modal_visible) {
        this.is_reset_password_modal_visible = state_change;
    }

    @action.bound
    setRealAccountSignupParams(params) {
        this.real_account_signup = {
            ...this.real_account_signup,
            ...params,
        };
    }

    @action.bound
    setRealAccountSignupEnd(has_ended) {
        this.has_real_account_signup_ended = has_ended;
    }

    @action.bound
    resetRealAccountSignupParams() {
        this.real_account_signup = {
            active_modal_index: -1,
            previous_currency : '',
            current_currency  : '',
            success_message   : '',
            error_message     : '',
        };
    }
}
