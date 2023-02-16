import { action, computed, observable, reaction, when, makeObservable } from 'mobx';
import { isCryptocurrency, isEmptyObject, getPropertyValue, routes, ContentFlag } from '@deriv/shared';
import type { P2PAdvertInfo } from '@deriv/api-types';
import Constants from 'Constants/constants';
import BaseStore from './base-store';
import PaymentAgentStore from './payment-agent-store';
import type { TRootStore, TWebSocket } from 'Types';

export default class GeneralStore extends BaseStore {
    constructor(public WS: TWebSocket, public root_store: TRootStore) {
        super({ root_store });

        makeObservable(this, {
            calculatePercentage: action.bound,
            cashier_route_tab_index: observable,
            changeSetCurrencyModalTitle: action.bound,
            checkP2pStatus: action.bound,
            continueRoute: action.bound,
            deposit_target: observable,
            getAdvertizerError: action.bound,
            getP2pCompletedOrders: action.bound,
            has_set_currency: observable,
            init: action.bound,
            is_cashier_locked: computed,
            is_cashier_onboarding: observable,
            is_crypto: computed,
            is_deposit: observable,
            is_loading: observable,
            is_p2p_enabled: computed,
            is_p2p_visible: observable,
            is_system_maintenance: computed,
            onMountCashierOnboarding: action.bound,
            onMountCommon: action.bound,
            onRemount: observable,
            p2p_advertiser_error: observable,
            p2p_completed_orders: observable,
            p2p_notification_count: observable,
            p2p_unseen_notifications: computed,
            percentage: observable,
            percentageSelectorSelectionStatus: action.bound,
            payment_agent: observable,
            setAccountSwitchListener: action.bound,
            setActiveTab: action.bound,
            setCashierTabIndex: action.bound,
            setDepositTarget: action.bound,
            setHasSetCurrency: action.bound,
            setIsCashierOnboarding: action.bound,
            setIsDeposit: action.bound,
            setIsP2pVisible: action.bound,
            setLoading: action.bound,
            setNotificationCount: action.bound,
            setOnRemount: action.bound,
            setP2pAdvertiserError: action.bound,
            setP2pCompletedOrders: action.bound,
            setShouldShowAllAvailableCurrencies: action.bound,
            should_percentage_reset: observable,
            should_set_currency_modal_title_change: observable,
            should_show_all_available_currencies: observable,
            show_p2p_in_cashier_onboarding: observable,
            showP2pInCashierOnboarding: action.bound,
        });

        when(
            () => this.root_store.client.is_logged_in,
            () => {
                this.setHasSetCurrency();
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

    active_container = Constants.containers.deposit;
    cashier_route_tab_index = 0;
    deposit_target = '';
    has_set_currency = false;
    is_cashier_onboarding = true;
    is_deposit = false;
    is_loading = false;
    is_p2p_visible = false;
    is_populating_values = false;
    onRemount: VoidFunction = () => this;
    p2p_advertiser_error?: string = undefined;
    p2p_completed_orders: P2PAdvertInfo[] | null = null;
    p2p_notification_count = 0;
    percentage = 0;
    payment_agent: PaymentAgentStore | null = null;
    should_percentage_reset = false;
    should_set_currency_modal_title_change = false;
    should_show_all_available_currencies = false;
    show_p2p_in_cashier_onboarding = false;

    setOnRemount(func: VoidFunction): void {
        this.onRemount = func;
    }

    get is_crypto(): boolean {
        const { currency } = this.root_store.client;
        return !!currency && isCryptocurrency(currency);
    }

    get is_p2p_enabled(): boolean {
        const { content_flag } = this.root_store.traders_hub;
        const is_eu = [ContentFlag.LOW_RISK_CR_EU, ContentFlag.EU_REAL].includes(content_flag);

        return this.is_p2p_visible && !is_eu;
    }

    /**
     * Gets the notifications from local storage, within p2p_settings, where it checks which notification has
     * been seen. The number of unseen notifications is displayed in vertical tab, notifications count, for P2P.
     *
     * @returns {number} Notifications that have not been seen by the user.
     */
    get p2p_unseen_notifications(): number {
        const p2p_settings = JSON.parse(localStorage.getItem('p2p_settings') || '{}');
        const local_storage_settings = p2p_settings[this.root_store.client.loginid || ''];

        if (isEmptyObject(local_storage_settings)) {
            return 0;
        }

        const unseen_notifications = local_storage_settings.notifications.filter(
            (notification: { is_seen: boolean }) => !notification.is_seen
        );

        return unseen_notifications.length;
    }

    showP2pInCashierOnboarding(): void {
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

    setHasSetCurrency(): void {
        const { account_list, has_active_real_account } = this.root_store.client;

        this.has_set_currency =
            account_list.filter(account => !account.is_virtual).some(account => account.title !== 'Real') ||
            !has_active_real_account;
    }

    changeSetCurrencyModalTitle(): void {
        this.should_set_currency_modal_title_change = true;
    }

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

    calculatePercentage(amount = this.root_store.modules.cashier.crypto_fiat_converter.converter_from_amount): void {
        const { client, modules } = this.root_store;
        const { account_transfer } = modules.cashier;

        if (this.active_container === account_transfer.container) {
            this.percentage = Number(((amount / Number(account_transfer.selected_from.balance)) * 100).toFixed(0));
        } else {
            this.percentage = Number(((amount / Number(client.balance)) * 100).toFixed(0));
        }
        if (!isFinite(this.percentage)) {
            this.percentage = 0;
        }
    }

    percentageSelectorSelectionStatus(should_percentage_reset: boolean): void {
        this.should_percentage_reset = should_percentage_reset;

        if (should_percentage_reset) {
            this.percentage = 0;
        }
    }

    setIsDeposit(is_deposit: boolean): void {
        this.is_deposit = is_deposit;
    }

    setShouldShowAllAvailableCurrencies(value: boolean): void {
        this.should_show_all_available_currencies = value;
    }

    setIsCashierOnboarding(is_cashier_onboarding: boolean): void {
        this.is_cashier_onboarding = is_cashier_onboarding;
    }

    setDepositTarget(target: string): void {
        this.deposit_target = target;
    }

    continueRoute(): void {
        this.root_store.common.routeTo(this.deposit_target);
    }

    setAccountSwitchListener(): void {
        // cashier inits once and tries to stay active until switching account
        // since cashier calls take a long time to respond or display in iframe
        // so we don't have any unmount function here and everything gets reset on switch instead
        this.disposeSwitchAccount();
        this.onSwitchAccount(this.accountSwitcherListener);
    }

    // Initialize P2P attributes on app load without mounting the entire cashier
    async init() {
        if (this.root_store.modules.cashier) {
            const {
                client: { is_logged_in, switched },
                modules,
            } = this.root_store;
            const { payment_agent, payment_agent_transfer, withdraw } = modules.cashier;

            // wait for client settings to be populated in client-store
            await this.WS.wait('get_settings');

            if (is_logged_in) {
                await this.getAdvertizerError();
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

    async getAdvertizerError() {
        const advertiser_info = await this.WS.authorized.p2pAdvertiserInfo?.();
        this.setP2pAdvertiserError(getPropertyValue(advertiser_info, ['error', 'code']));
    }

    setP2pAdvertiserError(value: string): void {
        this.p2p_advertiser_error = value;
    }

    checkP2pStatus(): void {
        const advertiser_error = this.p2p_advertiser_error;
        const is_p2p_restricted = advertiser_error === 'RestrictedCountry' || advertiser_error === 'RestrictedCurrency';
        this.setIsP2pVisible(!(is_p2p_restricted || this.root_store.client.is_virtual));
    }

    setP2pCompletedOrders(p2p_completed_orders: P2PAdvertInfo[]): void {
        this.p2p_completed_orders = p2p_completed_orders;
    }

    async getP2pCompletedOrders() {
        await this.WS.authorized.send?.({ p2p_order_list: 1, active: 0 }).then(response => {
            if (!response?.error) {
                const { p2p_order_list } = response;
                this.setP2pCompletedOrders(p2p_order_list?.list || []);
            }
        });
    }

    async onMountCommon(should_remount?: boolean) {
        const { client, common, modules } = this.root_store;
        const { is_from_derivgo, routeTo } = common;
        const { account_transfer, onramp, payment_agent, payment_agent_transfer, transaction_history } =
            modules.cashier;

        this.setNotificationCount(this.p2p_unseen_notifications);

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
            this.setLoading(true);
            await payment_agent.setPaymentAgentList();
            await payment_agent.filterPaymentAgentList();
            this.setLoading(false);

            if (!payment_agent_transfer.is_payment_agent) {
                payment_agent_transfer.checkIsPaymentAgent();
            }

            if (!account_transfer.accounts_list.length) {
                account_transfer.sortAccountsTransfer(null, is_from_derivgo);
            }

            if (!payment_agent.is_payment_agent_visible && window.location.pathname.endsWith(routes.cashier_pa)) {
                routeTo(routes.cashier_deposit);
            }

            if (!onramp.is_onramp_tab_visible && window.location.pathname.endsWith(routes.cashier_onramp)) {
                routeTo(routes.cashier_deposit);
            }

            if (
                !transaction_history.is_crypto_transactions_visible &&
                window.location.pathname.endsWith(routes.cashier_crypto_transactions)
            ) {
                routeTo(routes.cashier_deposit);
                transaction_history.setIsCryptoTransactionsVisible(true);
                transaction_history.onMount();
            }
        }
    }

    setCashierTabIndex(index: number): void {
        this.cashier_route_tab_index = index;
    }

    setNotificationCount(notification_count: number): void {
        this.p2p_notification_count = notification_count;
    }

    setIsP2pVisible(is_p2p_visible: boolean): void {
        this.is_p2p_visible = is_p2p_visible;
        if (!is_p2p_visible && window.location.pathname.endsWith(routes.cashier_p2p)) {
            this.root_store.common.routeTo(
                this.root_store.modules.cashier.account_prompt_dialog.last_location ?? routes.cashier_deposit
            );
        }
    }

    get is_cashier_locked(): boolean {
        const { account_status } = this.root_store.client;

        if (!account_status?.status) return false;
        return account_status.status.some(status_name => status_name === 'cashier_locked');
    }

    get is_system_maintenance(): boolean {
        const { account_status } = this.root_store.client;

        if (!account_status?.cashier_validation) return false;
        return account_status.cashier_validation.some(validation => validation === 'system_maintenance');
    }

    setLoading(is_loading: boolean): void {
        this.is_loading = is_loading;
    }

    setActiveTab(container: string): void {
        this.active_container = container;
    }

    accountSwitcherListener() {
        const { client, modules } = this.root_store;
        const { iframe, payment_agent, general_store } = modules.cashier;
        const { active_container } = general_store;
        const container = Constants.map_action[active_container];

        client.setVerificationCode('', container);
        iframe.clearIframe();

        this.payment_agent = payment_agent;
        if (payment_agent.active_tab_index === 1 && window.location.pathname.endsWith(routes.cashier_pa)) {
            payment_agent.setActiveTab(1);
        }

        this.is_populating_values = false;

        this.onRemount();

        return Promise.resolve();
    }
}
