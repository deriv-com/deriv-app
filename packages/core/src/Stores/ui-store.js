import { isMobile, isTouchDevice, LocalStore, routes, isBot } from '@deriv/shared';
import { MAX_MOBILE_WIDTH, MAX_TABLET_WIDTH } from 'Constants/ui';
import { action, autorun, computed, observable, makeObservable } from 'mobx';
import BaseStore from './base-store';

const store_name = 'ui_store';

export default class UIStore extends BaseStore {
    is_account_settings_visible = false;
    is_positions_drawer_on = false;
    is_reports_visible = false;
    reports_route_tab_index = 0;
    is_cashier_visible = false;
    is_history_tab_active = false;
    // TODO: [cleanup ui-store]
    // Take profit, Stop loss & Deal cancellation checkbox
    should_show_cancellation_warning = true;

    // Extensions
    footer_extensions = [];
    header_extension = undefined;
    settings_extension = undefined;
    notification_messages_ui = undefined;

    is_dark_mode_on = window?.matchMedia?.('(prefers-color-scheme: dark)').matches && isMobile();
    is_settings_modal_on = false;
    is_accounts_switcher_on = false;
    account_switcher_disabled_message = '';

    has_only_forward_starting_contracts = false;
    has_read_scam_message = localStorage.getItem('readScamMessage') || false;

    // Purchase Controls
    // @observable is_purchase_confirm_on    = false;
    is_services_error_visible = false;
    is_unsupported_contract_modal_visible = false;
    is_new_account = localStorage.getItem('isNewAccount') || false;
    is_account_signup_modal_visible = false;
    is_set_residence_modal_visible = false;
    is_reset_password_modal_visible = false;
    is_reset_email_modal_visible = false;
    is_update_email_modal_visible = false;
    is_reset_trading_password_modal_visible = false;
    // @observable is_purchase_lock_on       = false;

    // SmartCharts Controls
    // TODO: enable asset information
    // @observable is_chart_asset_info_visible = true;
    is_chart_countdown_visible = false;
    is_chart_layout_default = true;

    // PWA event and config
    pwa_prompt_event = null;

    screen_width = window.innerWidth;
    screen_height = window.innerHeight;
    is_onscreen_keyboard_active = false;

    is_advanced_duration = false;
    advanced_duration_unit = 't';
    advanced_expiry_type = 'duration';
    simple_duration_unit = 't';
    duration_t = 5;
    duration_s = 15;
    duration_m = 3;
    duration_h = 1;
    duration_d = 1;

    // purchase button states
    purchase_states = [false, false];

    // app states for modal
    is_app_disabled = false;
    is_route_modal_on = false;

    // real account signup
    is_real_acc_signup_on = false;
    real_account_signup_target = undefined;
    deposit_real_account_signup_target = undefined;
    has_real_account_signup_ended = false;

    // Welcome modal
    is_welcome_modal_visible = false;

    // Remove MX & MLT
    is_close_mx_mlt_account_modal_visible = false;

    // Remove MF account modal
    is_close_uk_account_modal_visible = false;

    // set currency modal
    is_set_currency_modal_visible = false;

    // position states
    show_positions_toggle = true;

    modal_index = 0;

    // Mt5 topup
    is_top_up_virtual_open = false;
    is_top_up_virtual_in_progress = false;
    is_top_up_virtual_success = false;

    // MT5 create real STP from demo, show only real accounts from switcher
    should_show_real_accounts_list = false;

    // MT5 acuity download
    is_acuity_modal_open = false;

    // Real account signup
    real_account_signup = {
        active_modal_index: -1,
        previous_currency: '',
        current_currency: '',
        success_message: '',
        error_message: '',
    };

    // UI Focus retention
    current_focus = null;

    // Mobile
    mobile_toast_timeout = 3500;
    toasts = [];

    is_cfd_page = false;
    is_nativepicker_visible = false;
    is_landscape = false;

    prompt_when = false;
    promptFn = () => {};

    // MT5 account needed modal
    is_account_needed_modal_on = false;
    account_needed_modal_props = {
        target: '',
        target_label: '',
        target_dmt5_label: '',
    };

    manage_real_account_tab_index = 0;

    //traders-hub
    is_real_tab_enabled = false;

    // onboarding
    should_show_multipliers_onboarding = false;
    choose_crypto_currency_target = null;

    // add crypto accounts
    should_show_cancel = false;

    app_contents_scroll_ref = null;
    is_deriv_account_needed_modal_visible = false;

    is_switch_to_deriv_account_modal_visible = false;

    getDurationFromUnit = unit => this[`duration_${unit}`];

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
            'is_warning_scam_message_modal_visible',
            // 'is_purchase_confirm_on',
            // 'is_purchase_lock_on',
            'should_show_cancellation_warning',
        ];

        super({ root_store, local_storage_properties, store_name });

        makeObservable(this, {
            is_account_settings_visible: observable,
            is_positions_drawer_on: observable,
            is_reports_visible: observable,
            reports_route_tab_index: observable,
            is_cashier_visible: observable,
            is_history_tab_active: observable,
            should_show_cancellation_warning: observable,
            footer_extensions: observable,
            header_extension: observable,
            settings_extension: observable,
            notification_messages_ui: observable,
            is_dark_mode_on: observable,
            is_settings_modal_on: observable,
            is_accounts_switcher_on: observable,
            account_switcher_disabled_message: observable,
            has_only_forward_starting_contracts: observable,
            has_read_scam_message: observable,
            is_services_error_visible: observable,
            is_unsupported_contract_modal_visible: observable,
            is_new_account: observable,
            is_account_signup_modal_visible: observable,
            is_set_residence_modal_visible: observable,
            is_reset_password_modal_visible: observable,
            is_reset_email_modal_visible: observable,
            is_update_email_modal_visible: observable,
            is_reset_trading_password_modal_visible: observable,
            is_chart_countdown_visible: observable,
            is_chart_layout_default: observable,
            pwa_prompt_event: observable,
            screen_width: observable,
            screen_height: observable,
            is_onscreen_keyboard_active: observable,
            is_advanced_duration: observable,
            advanced_duration_unit: observable,
            advanced_expiry_type: observable,
            simple_duration_unit: observable,
            duration_t: observable,
            duration_s: observable,
            duration_m: observable,
            duration_h: observable,
            duration_d: observable,
            purchase_states: observable,
            is_app_disabled: observable,
            is_route_modal_on: observable,
            is_real_acc_signup_on: observable,
            real_account_signup_target: observable,
            deposit_real_account_signup_target: observable,
            has_real_account_signup_ended: observable,
            is_acuity_modal_open: observable,
            is_welcome_modal_visible: observable,
            is_close_mx_mlt_account_modal_visible: observable,
            is_close_uk_account_modal_visible: observable,
            is_set_currency_modal_visible: observable,
            show_positions_toggle: observable,
            modal_index: observable,
            is_top_up_virtual_open: observable,
            is_top_up_virtual_in_progress: observable,
            is_top_up_virtual_success: observable,
            should_show_real_accounts_list: observable,
            real_account_signup: observable,
            current_focus: observable,
            toasts: observable.shallow,
            is_cfd_page: observable,
            is_nativepicker_visible: observable,
            is_landscape: observable,
            prompt_when: observable,
            promptFn: observable,
            is_account_needed_modal_on: observable,
            account_needed_modal_props: observable,
            manage_real_account_tab_index: observable,
            should_show_multipliers_onboarding: observable,
            choose_crypto_currency_target: observable,
            should_show_cancel: observable,
            app_contents_scroll_ref: observable,
            is_real_tab_enabled: observable,
            is_deriv_account_needed_modal_visible: observable,
            is_switch_to_deriv_account_modal_visible: observable,
            is_warning_scam_message_modal_visible: computed,
            setScamMessageLocalStorage: action.bound,
            setIsNewAccount: action.bound,
            init: action.bound,
            setAppContentsScrollRef: action.bound,
            populateFooterExtensions: action.bound,
            populateHeaderExtensions: action.bound,
            populateSettingsExtensions: action.bound,
            onChangeUiStore: action.bound,
            handleResize: action.bound,
            setPromptHandler: action.bound,
            showCloseMxMltAccountPopup: action.bound,
            showCloseUKAccountPopup: action.bound,
            is_mobile: computed,
            is_tablet: computed,
            is_account_switcher_disabled: computed,
            setRouteModal: action.bound,
            disableRouteModal: action.bound,
            disableApp: action.bound,
            enableApp: action.bound,
            toggleAccountsDialog: action.bound,
            setAccountSwitcherDisabledMessage: action.bound,
            setPurchaseState: action.bound,
            resetPurchaseStates: action.bound,
            setChartLayout: action.bound,
            setChartCountdown: action.bound,
            setDarkMode: action.bound,
            toggleSetCurrencyModal: action.bound,
            toggleCashier: action.bound,
            setModalIndex: action.bound,
            toggleSettingsModal: action.bound,
            openPositionsDrawer: action.bound,
            openRealAccountSignup: action.bound,
            setShouldShowCancel: action.bound,
            resetRealAccountSignupTarget: action.bound,
            setManageRealAccountActiveTabIndex: action.bound,
            closeRealAccountSignup: action.bound,
            openAccountNeededModal: action.bound,
            closeAccountNeededModal: action.bound,
            togglePositionsDrawer: action.bound,
            toggleAccountSettings: action.bound,
            toggleReports: action.bound,
            toggleServicesErrorModal: action.bound,
            removePWAPromptEvent: action.bound,
            setPWAPromptEvent: action.bound,
            setHasOnlyForwardingContracts: action.bound,
            toggleUnsupportedContractModal: action.bound,
            toggleAccountSignupModal: action.bound,
            toggleSetResidenceModal: action.bound,
            toggleCancellationWarning: action.bound,
            toggleHistoryTab: action.bound,
            setTopUpInProgress: action.bound,
            closeTopUpModal: action.bound,
            openTopUpModal: action.bound,
            closeSuccessTopUpModal: action.bound,
            toggleResetPasswordModal: action.bound,
            toggleResetEmailModal: action.bound,
            toggleUpdateEmailModal: action.bound,
            setResetTradingPasswordModalOpen: action.bound,
            setRealAccountSignupParams: action.bound,
            setRealAccountSignupEnd: action.bound,
            resetRealAccountSignupParams: action.bound,
            onOrientationChange: action.bound,
            toggleOnScreenKeyboard: action.bound,
            setCurrentFocus: action.bound,
            addToast: action.bound,
            removeToast: action.bound,
            setIsAcuityModalOpen: action.bound,
            setIsNativepickerVisible: action.bound,
            setReportsTabIndex: action.bound,
            toggleWelcomeModal: action.bound,
            notifyAppInstall: action.bound,
            installWithDeferredPrompt: action.bound,
            toggleShouldShowRealAccountsList: action.bound,
            toggleShouldShowMultipliersOnboarding: action.bound,
            shouldNavigateAfterChooseCrypto: action.bound,
            continueRouteAfterChooseCrypto: action.bound,
            openDerivRealAccountNeededModal: action.bound,
            openSwitchToRealAccountModal: action.bound,
            setIsRealTabEnabled: action.bound,
        });

        window.addEventListener('resize', this.handleResize);
        autorun(() => {
            this.changeTheme();
        });
    }
    changeTheme = () => {
        if (this.is_dark_mode_on) {
            document.body.classList.remove('theme--light');
            document.body.classList.add('theme--dark');
        } else {
            document.body.classList.remove('theme--dark');
            document.body.classList.add('theme--light');
        }
    };

    get is_warning_scam_message_modal_visible() {
        return (
            this.root_store.client.is_logged_in &&
            this.root_store.client.is_brazil &&
            !this.has_read_scam_message &&
            !this.is_new_account
        );
    }

    setIsRealTabEnabled(is_real_tab_enabled) {
        this.is_real_tab_enabled = is_real_tab_enabled;
    }

    setScamMessageLocalStorage() {
        localStorage.setItem('readScamMessage', !this.has_read_scam_message);
        this.has_read_scam_message = localStorage.getItem('readScamMessage') || false;
    }

    setIsNewAccount() {
        localStorage.setItem('isNewAccount', !this.is_new_account);
        this.is_new_account = localStorage.getItem('isNewAccount') || false;
    }

    init(notification_messages) {
        this.notification_messages_ui = notification_messages;
    }

    setAppContentsScrollRef(value) {
        this.app_contents_scroll_ref = value;
    }

    populateFooterExtensions(footer_extensions) {
        this.footer_extensions = footer_extensions;
    }

    populateHeaderExtensions(component) {
        this.header_extension = component;
    }

    populateSettingsExtensions(menu_items) {
        this.settings_extension = menu_items;
    }

    onChangeUiStore({ name, value }) {
        if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }
        this[name] = value;
    }

    handleResize() {
        this.screen_width = window.innerWidth;
        this.screen_height = window.innerHeight;
    }

    setPromptHandler(condition, cb = () => {}) {
        this.prompt_when = condition;
        this.promptFn = cb;
    }

    showCloseMxMltAccountPopup(is_open) {
        this.is_close_mx_mlt_account_modal_visible = is_open;
    }

    showCloseUKAccountPopup(is_open) {
        this.is_close_uk_account_modal_visible = is_open;
    }

    get is_mobile() {
        return this.screen_width <= MAX_MOBILE_WIDTH;
    }

    get is_tablet() {
        return this.screen_width <= MAX_TABLET_WIDTH;
    }

    get is_account_switcher_disabled() {
        return !!this.account_switcher_disabled_message;
    }

    setRouteModal() {
        this.is_route_modal_on = true;
    }

    disableRouteModal() {
        this.is_route_modal_on = false;
    }

    disableApp() {
        this.is_app_disabled = true;
    }

    enableApp() {
        this.is_app_disabled = false;
    }

    toggleAccountsDialog(status = !this.is_accounts_switcher_on) {
        this.is_accounts_switcher_on = status;
    }

    setAccountSwitcherDisabledMessage(message) {
        if (message) {
            this.is_accounts_switcher_on = false;
            this.account_switcher_disabled_message = message;
        } else {
            this.account_switcher_disabled_message = '';
        }
    }

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
            [].forEach.bind(el_purchase_buttons, el => {
                el.classList.add('btn-purchase--disabled');
            })();
        }, 250);
    }

    resetPurchaseStates() {
        this.purchase_states = [false, false];
    }

    setChartLayout(is_default) {
        this.is_chart_layout_default = is_default;
    }

    // TODO: enable asset information
    // @action.bound
    // setChartAssetInfo(is_visible) {
    //     this.is_chart_asset_info_visible = is_visible;
    // }

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

    setDarkMode(is_dark_mode_on) {
        if (this.is_dark_mode_on !== is_dark_mode_on) {
            this.is_dark_mode_on = is_dark_mode_on;
            // This GTM call is here instead of the GTM store due to frequency of use
            this.root_store.gtm.pushDataLayer({ event: 'switch theme' });
            if (isBot()) {
                location.reload();
            }
        }

        return this.is_dark_mode_on;
    }

    toggleSetCurrencyModal() {
        this.is_set_currency_modal_visible = !this.is_set_currency_modal_visible;
    }

    toggleCashier() {
        this.is_cashier_visible = !this.is_cashier_visible;
    }

    setModalIndex(index = 0) {
        this.modal_index = index;
    }

    toggleSettingsModal() {
        this.is_settings_modal_on = !this.is_settings_modal_on;
    }

    openPositionsDrawer() {
        // show and hide Positions Drawer
        this.is_positions_drawer_on = true;
    }

    openRealAccountSignup(target = this.root_store.client.upgradeable_landing_companies?.[0]) {
        this.is_real_acc_signup_on = true;
        this.real_account_signup_target = target;
        this.is_accounts_switcher_on = false;
    }

    setShouldShowCancel(value) {
        this.should_show_cancel = value;
    }

    resetRealAccountSignupTarget() {
        this.deposit_real_account_signup_target = this.real_account_signup_target;
        this.real_account_signup_target = '';
    }

    setManageRealAccountActiveTabIndex(index) {
        this.manage_real_account_tab_index = index;
    }

    closeRealAccountSignup() {
        this.is_real_acc_signup_on = false;
        this.resetRealAccountSignupTarget();
        setTimeout(() => {
            this.resetRealAccountSignupParams();
            this.setRealAccountSignupEnd(true);
        }, 300);
    }

    openAccountNeededModal(target, target_label, target_dmt5_label) {
        this.is_account_needed_modal_on = true;
        this.account_needed_modal_props = {
            target,
            target_label,
            target_dmt5_label,
        };
    }

    closeAccountNeededModal() {
        this.is_account_needed_modal_on = false;
        this.account_needed_modal_props = {
            target: '',
            target_label: '',
            target_dmt5_label: '',
        };
    }

    togglePositionsDrawer() {
        // toggle Positions Drawer
        this.is_positions_drawer_on = !this.is_positions_drawer_on;
    }

    toggleAccountSettings(is_visible) {
        this.is_account_settings_visible = is_visible;
    }

    toggleReports(is_visible) {
        this.is_reports_visible = is_visible;
    }

    toggleServicesErrorModal(is_visible) {
        this.is_services_error_visible = is_visible;
    }

    removePWAPromptEvent() {
        this.pwa_prompt_event = null;
    }

    setPWAPromptEvent(e) {
        this.pwa_prompt_event = e;
    }

    setHasOnlyForwardingContracts(has_only_forward_starting_contracts) {
        this.has_only_forward_starting_contracts = has_only_forward_starting_contracts;
    }

    toggleUnsupportedContractModal(state_change = !this.is_unsupported_contract_modal_visible) {
        this.is_unsupported_contract_modal_visible = state_change;
    }

    toggleAccountSignupModal(state_change = !this.is_account_signup_modal_visible) {
        this.is_account_signup_modal_visible = state_change;
    }

    toggleSetResidenceModal(state_change = !this.is_set_residence_modal_visible) {
        this.is_set_residence_modal_visible = state_change;
    }

    toggleCancellationWarning(state_change = !this.should_show_cancellation_warning) {
        this.should_show_cancellation_warning = state_change;
    }

    toggleHistoryTab(state_change = !this.is_history_tab_active) {
        this.is_history_tab_active = state_change;
    }

    setTopUpInProgress(bool) {
        this.is_top_up_virtual_in_progress = bool;
    }

    closeTopUpModal() {
        this.is_top_up_virtual_open = false;
    }

    openTopUpModal() {
        this.is_top_up_virtual_open = true;
    }

    closeSuccessTopUpModal() {
        this.is_top_up_virtual_success = false;
    }

    toggleResetPasswordModal(state_change = !this.is_reset_password_modal_visible) {
        this.is_reset_password_modal_visible = state_change;
    }

    toggleResetEmailModal(state_change = !this.is_reset_email_modal_visible) {
        this.is_reset_email_modal_visible = state_change;
    }

    toggleUpdateEmailModal(state_change = !this.is_update_email_modal_visible) {
        this.is_update_email_modal_visible = state_change;
    }

    setResetTradingPasswordModalOpen(is_reset_trading_password_modal_visible) {
        this.is_reset_trading_password_modal_visible = is_reset_trading_password_modal_visible;
    }

    setRealAccountSignupParams(params) {
        this.real_account_signup = {
            ...this.real_account_signup,
            ...params,
        };
    }

    setRealAccountSignupEnd(has_ended) {
        this.has_real_account_signup_ended = has_ended;
    }

    resetRealAccountSignupParams() {
        this.real_account_signup = {
            active_modal_index: -1,
            previous_currency: '',
            current_currency: '',
            success_message: '',
            error_message: '',
        };
    }

    onOrientationChange({ is_landscape_orientation }) {
        this.is_landscape = is_landscape_orientation;
    }

    toggleOnScreenKeyboard() {
        this.is_onscreen_keyboard_active = this.current_focus !== null && this.is_mobile && isTouchDevice();
    }

    setCurrentFocus(value) {
        this.current_focus = value;
        this.toggleOnScreenKeyboard();
    }

    addToast(toast_config) {
        toast_config.key = toast_config.key ?? toast_config.content;
        const toast_index = this.toasts.findIndex(t => t.key === toast_config.key);
        if (toast_index > -1) {
            this.toasts.splice(toast_index, 1);
        }

        toast_config.timeout = toast_config.timeout ?? this.mobile_toast_timeout;
        if (toast_config.is_bottom) {
            this.toasts.push(toast_config);
        } else {
            this.toasts.unshift(toast_config);
        }
    }

    removeToast(key) {
        const index = this.toasts.findIndex(t => t.key === key);
        if (index > -1) {
            this.toasts.splice(index, 1);
        }
    }

    setIsNativepickerVisible(is_nativepicker_visible) {
        this.is_nativepicker_visible = is_nativepicker_visible;
    }

    setReportsTabIndex(tab_index = 0) {
        this.reports_route_tab_index = tab_index;
    }

    toggleWelcomeModal({ is_visible = !this.is_welcome_modal_visible, should_persist = false }) {
        if (LocalStore.get('has_viewed_welcome_screen') && !should_persist) return;
        this.is_welcome_modal_visible = is_visible;

        if (!is_visible) {
            LocalStore.set('has_viewed_welcome_screen', true);
        }
    }

    notifyAppInstall(prompt) {
        this.deferred_prompt = prompt;
        setTimeout(() => {
            this.root_store.notifications.addNotificationMessageByKey('install_pwa');
        }, 10000);
    }

    async installWithDeferredPrompt() {
        this.deferred_prompt.prompt();
        const choice = await this.deferred_prompt.userChoice;
        if (choice.outcome === 'accepted') {
            const notification_key = 'install_pwa';
            this.root_store.notifications.removeNotificationMessage({
                key: notification_key,
                should_show_again: false,
            });
            this.root_store.notifications.removeNotificationByKey({ key: notification_key });
        }
    }

    toggleShouldShowRealAccountsList(value) {
        this.should_show_real_accounts_list = value;
    }

    setIsAcuityModalOpen(value) {
        this.is_acuity_modal_open = value;
    }

    toggleShouldShowMultipliersOnboarding(value) {
        this.should_show_multipliers_onboarding = value;
    }

    shouldNavigateAfterChooseCrypto(next_location) {
        this.choose_crypto_currency_target = next_location;
    }

    continueRouteAfterChooseCrypto() {
        this.root_store.common.routeTo(this.choose_crypto_currency_target);

        if (this.choose_crypto_currency_target === routes.cashier_deposit) {
            this.root_store.modules.cashier.general_store.setIsDeposit(true);
        }
    }

    openDerivRealAccountNeededModal() {
        this.is_deriv_account_needed_modal_visible = !this.is_deriv_account_needed_modal_visible;
    }

    openSwitchToRealAccountModal() {
        this.is_switch_to_deriv_account_modal_visible = !this.is_switch_to_deriv_account_modal_visible;
    }
}
