import React from 'react';
import { action, computed, observable, reaction, when } from 'mobx';
import { isCryptocurrency, getPropertyValue, routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import Constants from 'Constants/constants';
import CashierNotifications from 'Components/cashier-notifications';
import BaseStore from './base-store';

export default class GeneralStore extends BaseStore {
    constructor({ root_store, WS }) {
        super({ root_store });
        this.WS = WS;
        this.root_store = root_store;

        when(
            () => this.root_store.client.is_logged_in,
            () => {
                this.setHasSetCurrency();
                this.attachCashierToMenu();
            }
        );

        if (!this.has_set_currency) {
            this.changeSetCurrencyModalTitle();
        }

        reaction(
            () => [
                this.root_store.client.switched,
                this.root_store.client.is_logged_in,
                this.root_store.client.currency,
            ],
            () => {
                this.init();
            }
        );
    }

    @observable is_loading = false;
    @observable is_p2p_visible = false;
    @observable p2p_notification_count = 0;
    @observable cashier_route_tab_index = 0;
    @observable is_deposit = false;
    @observable should_show_all_available_currencies = false;
    @observable is_cashier_onboarding = true;
    @observable deposit_target = '';
    @observable should_set_currency_modal_title_change = false;
    @observable p2p_advertiser_error = undefined;
    @observable has_set_currency = false;
    @observable should_percentage_reset = false;
    @observable percentage = 0;
    @observable show_p2p_in_cashier_onboarding = false;
    @observable onRemount = () => {};
    @observable p2p_completed_orders = null;

    active_container = Constants.containers.deposit;
    is_populating_values = false;

    @action.bound
    setOnRemount(func) {
        this.onRemount = func;
    }

    @computed
    get is_crypto() {
        const { currency } = this.root_store.client;
        return !!currency && isCryptocurrency(currency);
    }

    @computed
    get is_p2p_enabled() {
        return this.is_p2p_visible && !this.root_store.client.is_eu;
    }

    @action.bound
    showP2pInCashierOnboarding() {
        const { account_list, is_virtual } = this.root_store.client;

        const is_p2p_restricted = this.p2p_advertiser_error === 'RestrictedCountry';
        const has_usd_currency = account_list.some(account => account.title === 'USD');
        const has_user_fiat_currency = account_list.some(
            account => !isCryptocurrency(account.title) && account.title !== 'Real'
        );

        if (is_p2p_restricted || is_virtual || (has_user_fiat_currency && !has_usd_currency)) {
            this.show_p2p_in_cashier_onboarding = false;
        } else {
            this.show_p2p_in_cashier_onboarding = true;
        }
    }

    @action.bound
    attachCashierToMenu() {
        const { menu, ui } = this.root_store;

        if (!this.has_set_currency) {
            this.setHasSetCurrency();
        }

        menu.attach({
            id: 'dt_cashier_tab',
            icon: <CashierNotifications p2p_notification_count={this.p2p_notification_count} />,
            text: () => localize('Cashier'),
            link_to: this.has_set_currency && routes.cashier,
            onClick: !this.has_set_currency && ui.toggleSetCurrencyModal,
            login_only: true,
        });
    }

    @action.bound
    replaceCashierMenuOnclick() {
        const { menu, ui } = this.root_store;

        this.setHasSetCurrency();

        menu.update(
            {
                id: 'dt_cashier_tab',
                icon: <CashierNotifications p2p_notification_count={this.p2p_notification_count} />,
                text: () => localize('Cashier'),
                link_to: this.has_set_currency && routes.cashier,
                onClick: !this.has_set_currency ? ui.toggleSetCurrencyModal : false,
                login_only: true,
            },
            1
        );
    }

    @action.bound
    setHasSetCurrency() {
        const { account_list, has_active_real_account } = this.root_store.client;

        this.has_set_currency =
            account_list.filter(account => !account.is_virtual).some(account => account.title !== 'Real') ||
            !has_active_real_account;
    }

    @action.bound
    changeSetCurrencyModalTitle() {
        this.should_set_currency_modal_title_change = true;
    }

    @action.bound
    async onMountCashierOnboarding() {
        const { account_prompt_dialog, payment_agent } = this.root_store.modules.cashier;

        if (!this.has_set_currency) {
            this.setHasSetCurrency();
        }
        this.setIsCashierOnboarding(true);
        account_prompt_dialog.resetIsConfirmed();

        this.setLoading(true);
        if (!payment_agent.all_payment_agent_list?.paymentagent_list?.list) {
            const agent_list = await payment_agent.getAllPaymentAgentList();
            payment_agent.setAllPaymentAgentList(agent_list);
        }
        this.setLoading(false);
    }

    @action.bound
    calculatePercentage(amount = this.root_store.modules.cashier.crypto_fiat_converter.converter_from_amount) {
        const { client, modules } = this.root_store;
        const { account_transfer } = modules.cashier;

        if (this.active_container === account_transfer.container) {
            this.percentage = +((amount / +account_transfer.selected_from.balance) * 100).toFixed(0);
        } else {
            this.percentage = +((amount / +client.balance) * 100).toFixed(0);
        }
        if (!isFinite(this.percentage)) {
            this.percentage = 0;
        }
    }

    @action.bound
    percentageSelectorSelectionStatus(should_percentage_reset) {
        this.should_percentage_reset = should_percentage_reset;

        if (should_percentage_reset) {
            this.percentage = 0;
        }
    }

    @action.bound
    setIsDeposit(is_deposit) {
        this.is_deposit = is_deposit;
    }

    @action.bound
    setShouldShowAllAvailableCurrencies(value) {
        this.should_show_all_available_currencies = value;
    }

    @action.bound
    setIsCashierOnboarding(is_cashier_onboarding) {
        this.is_cashier_onboarding = is_cashier_onboarding;
    }

    @action.bound
    setDepositTarget(target) {
        this.deposit_target = target;
    }

    @action.bound
    continueRoute() {
        this.root_store.common.routeTo(this.deposit_target);
    }

    @action.bound
    setAccountSwitchListener() {
        // cashier inits once and tries to stay active until switching account
        // since cashier calls take a long time to respond or display in iframe
        // so we don't have any unmount function here and everything gets reset on switch instead
        this.disposeSwitchAccount();
        this.onSwitchAccount(this.accountSwitcherListener);
    }

    // Initialise P2P attributes on app load without mounting the entire cashier
    @action.bound
    async init() {
        if (this.root_store.modules.cashier) {
            const {
                client: { is_logged_in, switched },
                modules,
            } = this.root_store;
            const { account_prompt_dialog, payment_agent, payment_agent_transfer, withdraw } = modules.cashier;

            // wait for client settings to be populated in client-store
            await this.WS.wait('get_settings');

            if (is_logged_in) {
                await this.getAdvertizerError();
                account_prompt_dialog.resetLastLocation();
                if (!switched) {
                    this.checkP2pStatus();
                    payment_agent.setPaymentAgentList().then(payment_agent.filterPaymentAgentList);
                    if (!payment_agent_transfer.is_payment_agent) {
                        payment_agent_transfer.checkIsPaymentAgent();
                    }
                    // check if withdrawal limit is reached
                    // if yes, this will trigger to show a notification
                    await withdraw.check10kLimit();
                }
            }
        }
    }

    @action.bound
    async getAdvertizerError() {
        const advertiser_info = await this.WS.authorized.p2pAdvertiserInfo();
        this.setP2pAdvertiserError(getPropertyValue(advertiser_info, ['error', 'code']));
    }

    @action.bound
    setP2pAdvertiserError(value) {
        this.p2p_advertiser_error = value;
    }

    @action.bound
    checkP2pStatus() {
        const advertiser_error = this.p2p_advertiser_error;
        const is_p2p_restricted = advertiser_error === 'RestrictedCountry' || advertiser_error === 'RestrictedCurrency';
        this.setIsP2pVisible(!(is_p2p_restricted || this.root_store.client.is_virtual));
    }

    @action.bound
    setP2pCompletedOrders(p2p_completed_orders) {
        this.p2p_completed_orders = p2p_completed_orders;
    }

    @action.bound
    async getP2pCompletedOrders() {
        await this.WS.authorized.send({ p2p_order_list: 1, active: 0 }).then(response => {
            if (!response?.error) {
                const { p2p_order_list } = response;
                this.setP2pCompletedOrders(p2p_order_list.list);
            }
        });
    }

    @action.bound
    async onMountCommon(should_remount) {
        const { client, common, modules } = this.root_store;
        const { account_transfer, onramp, payment_agent, payment_agent_transfer, transaction_history } =
            modules.cashier;

        if (client.is_logged_in) {
            // avoid calling this again
            if (this.is_populating_values) {
                return;
            }

            this.is_populating_values = true;

            if (should_remount) {
                this.setOnRemount(this.onMountCommon);
            }
            // we need to see if client's country has PA
            // if yes, we can show the PA tab in cashier
            await payment_agent.setPaymentAgentList();
            await payment_agent.filterPaymentAgentList();

            if (!payment_agent_transfer.is_payment_agent) {
                payment_agent_transfer.checkIsPaymentAgent();
            }

            if (!account_transfer.accounts_list.length) {
                account_transfer.sortAccountsTransfer();
            }

            if (!payment_agent.is_payment_agent_visible && window.location.pathname.endsWith(routes.cashier_pa)) {
                common.routeTo(routes.cashier_deposit);
            }

            if (!onramp.is_onramp_tab_visible && window.location.pathname.endsWith(routes.cashier_onramp)) {
                common.routeTo(routes.cashier_deposit);
            }

            if (
                !transaction_history.is_crypto_transactions_visible &&
                window.location.pathname.endsWith(routes.cashier_crypto_transactions)
            ) {
                common.routeTo(routes.cashier_deposit);
                transaction_history.setIsCryptoTransactionsVisible(true);
                transaction_history.onMount();
            }
        }
    }

    @action.bound
    setCashierTabIndex(index) {
        this.cashier_route_tab_index = index;
    }

    @action.bound
    setNotificationCount(notification_count) {
        this.p2p_notification_count = notification_count;
    }

    @action.bound
    setIsP2pVisible(is_p2p_visible) {
        this.is_p2p_visible = is_p2p_visible;
        if (!is_p2p_visible && window.location.pathname.endsWith(routes.cashier_p2p)) {
            this.root_store.common.routeTo(
                this.root_store.modules.cashier.account_prompt_dialog.last_location ?? routes.cashier_deposit
            );
        }
    }

    @computed
    get is_cashier_locked() {
        const { account_status } = this.root_store.client;

        if (!account_status?.status) return false;
        return account_status.status.some(status_name => status_name === 'cashier_locked');
    }

    @computed
    get is_system_maintenance() {
        const { account_status } = this.root_store.client;

        if (!account_status?.cashier_validation) return false;
        return account_status.cashier_validation.some(validation => validation === 'system_maintenance');
    }

    @action.bound
    setLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setActiveTab(container) {
        this.active_container = container;
    }

    accountSwitcherListener() {
        const { iframe, payment_agent, withdraw } = this.root_store.modules.cashier;

        withdraw.verification.clearVerification();
        payment_agent.verification.clearVerification();
        iframe.clearIframe();

        this.payment_agent = payment_agent;
        this.is_populating_values = false;

        this.onRemount();

        return Promise.resolve();
    }
}
