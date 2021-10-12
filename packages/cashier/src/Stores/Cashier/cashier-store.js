/* eslint-disable max-classes-per-file */
import React from 'react';
import { action, computed, observable, toJS, reaction, when } from 'mobx';
import {
    formatMoney,
    isEmptyObject,
    isCryptocurrency,
    getCurrencies,
    getCurrencyDisplayCode,
    getDecimalPlaces,
    getMinWithdrawal,
    getCFDAccountDisplay,
    getCFDAccount,
    getPropertyValue,
    routes,
    validNumber,
    CFD_PLATFORMS,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import BaseStore from '../base-store';
import CashierNotifications from '../../Containers/cashier-notifications.jsx';
import VerificationStore from '../verification-store';
import ErrorStore from '../error-store';

const hasTransferNotAllowedLoginid = loginid => loginid.startsWith('MX');

const getSelectedError = (selected_value, is_from_account) => {
    if (is_from_account) {
        return (
            <Localize
                i18n_default_text='Transfer from {{selected_value}} is not allowed, Please choose another account from dropdown'
                values={{ selected_value }}
            />
        );
    }

    return (
        <Localize
            i18n_default_text='Transfer to {{selected_value}} is not allowed, Please choose another account from dropdown'
            values={{ selected_value }}
        />
    );
};

class Config {
    container = '';
    is_session_timeout = true;
    onIframeLoaded = '';
    timeout_session = '';

    @observable iframe_height = 0;
    @observable iframe_url = '';

    constructor({ container }) {
        this.container = container;
    }
}

class ConfigAccountTransfer {
    @observable accounts_list = [];
    @observable container = 'account_transfer';
    @observable error = new ErrorStore();
    @observable has_no_account = false;
    @observable has_no_accounts_balance = false;
    @observable is_transfer_confirm = false;
    @observable is_transfer_successful = false;
    @observable is_mt5_transfer_in_progress = false;
    @observable minimum_fee = null;
    @observable receipt = {};
    @observable selected_from = {};
    @observable selected_to = {};
    @observable account_transfer_amount = '';
    @observable transfer_fee = null;
    @observable transfer_limit = {};

    @action.bound
    setBalanceByLoginId(loginid, balance) {
        this.accounts_list.find(acc => loginid === acc.value).balance = balance;
    }

    @action.bound
    setBalanceSelectedFrom(balance) {
        this.selected_from.balance = balance;
    }

    @action.bound
    setBalanceSelectedTo(balance) {
        this.selected_to.balance = balance;
    }
}

class ConfigWithdraw {
    @observable container = 'withdraw';
    @observable iframe_height = 0;
    @observable iframe_url = '';
    @observable error = new ErrorStore();
    @observable verification = new VerificationStore({ root_store: this.root_store, WS: this.WS });

    is_session_timeout = true;
    onIframeLoaded = '';
    timeout_session = '';
}

export default class CashierStore extends BaseStore {
    constructor({ root_store, WS }) {
        super({ root_store });
        this.WS = WS;
        this.root_store = root_store;

        this.root_store.menu.attach({
            id: 'dt_cashier_tab',
            icon: <CashierNotifications p2p_notification_count={this.p2p_notification_count} />,
            text: () => localize('Cashier'),
            link_to: routes.cashier,
            login_only: true,
        });

        this.init();
    }

    @observable is_loading = false;
    @observable is_p2p_visible = false;
    @observable p2p_notification_count = 0;
    @observable cashier_route_tab_index = 0;
    @observable is_10k_withdrawal_limit_reached = undefined;
    @observable is_deposit = false;
    @observable is_cashier_default = true;
    @observable withdraw_amount = '';
    @observable converter_from_amount = '';
    @observable converter_to_amount = '';
    @observable converter_from_error = '';
    @observable converter_to_error = '';
    @observable is_timer_visible = false;
    @observable is_crypto_transactions_visible = false;
    @observable blockchain_address = '';
    @observable should_percentage_reset = false;
    @observable percentage = 0;
    @observable is_withdraw_confirmed = false;

    @observable config = {
        account_transfer: new ConfigAccountTransfer(),
        deposit: {
            ...toJS(new Config({ container: 'deposit' })),
            error: new ErrorStore(),
        },
        payment_agent: this.root_store.modules.cashier?.payment_agent_store,
        payment_agent_transfer: this.root_store.modules.cashier?.payment_agent_transfer_store,
        withdraw: new ConfigWithdraw(),
    };
    active_container = this.config.deposit.container;
    onRemount = () => {};
    is_populating_values = false;

    containers = [this.config.deposit.container, this.config.withdraw.container];

    map_action = {
        [this.config.withdraw.container]: 'payment_withdraw',
        [this.root_store.modules.cashier?.payment_agent_store.container]: 'payment_agent_withdraw',
    };

    @computed
    get is_crypto() {
        const { currency } = this.root_store.client;
        return !!currency && isCryptocurrency(currency);
    }

    @computed
    get is_account_transfer_visible() {
        // cashier Transfer account tab is hidden for iom clients
        // check for residence to hide the tab before creating a real money account
        return this.root_store.client.residence !== 'im';
    }

    @computed
    get is_p2p_enabled() {
        return this.is_p2p_visible && !this.root_store.client.is_eu;
    }

    @action.bound
    setIsWithdrawConfirmed(is_withdraw_confirmed) {
        this.is_withdraw_confirmed = is_withdraw_confirmed;

        if (is_withdraw_confirmed) this.setWithdrawAmount(this.converter_from_amount);

        if (!is_withdraw_confirmed && this.config[this.active_container]?.verification) {
            this.config.withdraw.verification.clearVerification('payment_withdraw');
        }
    }

    @action.bound
    setWithdrawAmount(amount) {
        this.withdraw_amount = amount;
    }

    @action.bound
    calculatePercentage(amount = this.converter_from_amount) {
        if (this.active_container === this.config.account_transfer.container) {
            this.percentage = +((amount / +this.config.account_transfer.selected_from.balance) * 100).toFixed(0);
        } else {
            this.percentage = +((amount / +this.root_store.client.balance) * 100).toFixed(0);
        }
    }

    @action.bound
    percentageSelectorSelectionStatus(should_percentage_reset) {
        this.should_percentage_reset = should_percentage_reset;

        if (should_percentage_reset) {
            this.percentage = 0;
        }
    }

    async saveWithdraw(verification_code) {
        this.config.withdraw.error.setErrorMessage('');
        await this.WS.cryptoWithdraw({
            address: this.blockchain_address,
            amount: +this.converter_from_amount,
            verification_code,
        }).then(response => {
            if (response.error) {
                this.config.withdraw.error.setErrorMessage(response.error);
                if (verification_code) {
                    // clear verification code on error
                    this.config.withdraw.verification.clearVerification('payment_withdraw');
                }
                this.resetWithrawForm();
            } else {
                this.setIsWithdrawConfirmed(true);
            }
        });
    }

    @action.bound
    async requestWithdraw(verification_code) {
        if (!this.root_store.client.is_logged_in) {
            return;
        }

        if (!this.converter_from_amount) {
            this.setConverterFromError(localize('This field is required.'));
            return;
        }

        await this.WS.cryptoWithdraw({
            address: this.blockchain_address,
            amount: +this.converter_from_amount,
            verification_code,
            dry_run: 1,
        }).then(response => {
            if (response.error) {
                this.root_store.modules.cashier.error_dialog.setErrorMessage(response.error.message);
            } else {
                this.saveWithdraw(verification_code);
            }
        });
    }

    @action.bound
    resetWithrawForm() {
        this.setBlockchainAddress('');
        this.setConverterFromAmount('');
        this.setConverterToAmount('');
        this.config.withdraw.verification.clearVerification('payment_withdraw');
    }

    @action.bound
    setIsDeposit(is_deposit) {
        this.is_deposit = is_deposit;
    }

    @action.bound
    setBlockchainAddress(address) {
        this.blockchain_address = address;
    }

    @action.bound
    setIsCashierDefault(is_cashier_default) {
        this.is_cashier_default = is_cashier_default;
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
    init() {
        when(
            () => this.root_store.client.is_logged_in,
            async () => {
                await this.checkP2pStatus();
            }
        );

        reaction(
            () => [
                this.root_store.client.switched,
                this.root_store.client.is_logged_in,
                this.root_store.client.currency,
            ],
            async () => {
                // wait for client settings to be populated in client-store
                await this.WS.wait('get_settings');

                if (this.root_store.client.is_logged_in) {
                    await this.checkP2pStatus();
                    await this.root_store.modules.cashier?.payment_agent_store.filterPaymentAgentList();
                }
            }
        );

        reaction(
            () => [this.root_store.client.currency],
            () => {
                this.setIsWithdrawConfirmed(false);
            }
        );
    }

    @action.bound
    async checkP2pStatus() {
        const advertiser_info = await this.WS.authorized.p2pAdvertiserInfo();
        const advertiser_error = getPropertyValue(advertiser_info, ['error', 'code']);
        const is_p2p_restricted = advertiser_error === 'RestrictedCountry' || advertiser_error === 'RestrictedCurrency';
        this.setIsP2pVisible(!(is_p2p_restricted || this.root_store.client.is_virtual));
    }

    @action.bound
    async onMountCommon(should_remount) {
        if (this.root_store.client.is_logged_in) {
            // avoid calling this again
            if (this.is_populating_values) {
                return;
            }

            this.is_populating_values = true;

            if (should_remount) {
                this.onRemount = this.onMountCommon;
            }
            // we need to see if client's country has PA
            // if yes, we can show the PA tab in cashier
            if (!this.root_store.modules.cashier?.payment_agent_store.list.length) {
                this.root_store.modules.cashier?.payment_agent_store
                    .setPaymentAgentList()
                    .then(this.root_store.modules.cashier?.payment_agent_store.filterPaymentAgentList);
            }

            if (!this.root_store.modules.cashier?.payment_agent_transfer_store.is_payment_agent) {
                this.root_store.modules.cashier?.payment_agent_transfer_store.checkIsPaymentAgent();
            }

            if (!this.config.account_transfer.accounts_list.length) {
                this.sortAccountsTransfer();
            }

            if (
                !this.root_store.modules.cashier.onramp.is_onramp_tab_visible &&
                window.location.pathname.endsWith(routes.cashier_onramp)
            ) {
                this.root_store.common.routeTo(routes.cashier_deposit);
            }

            if (
                !this.is_crypto_transactions_visible &&
                window.location.pathname.endsWith(routes.cashier_crypto_transactions)
            ) {
                this.root_store.common.routeTo(routes.cashier_deposit);
                this.root_store.modules.cashier.transaction_history.setIsCryptoTransactionsVisible(true);
                this.root_store.modules.cashier.transaction_history.onMount();
            }
        }
    }

    @action.bound
    setIsCryptoTransactionsVisible(is_visible) {
        this.is_crypto_transactions_visible = is_visible;
    }

    @action.bound
    setCashierTabIndex(index) {
        this.cashier_route_tab_index = index;
    }

    @action.bound
    willMountWithdraw(verification_code) {
        if (verification_code) {
            this.config.withdraw.verification.clearVerification('payment_withdraw');
        }
    }

    @action.bound
    async onMountWithdraw(verification_code) {
        this.setLoading(true);
        const strRegExp = /^\w{8,128}$/;
        let response_cashier;

        if (strRegExp.test(verification_code)) {
            response_cashier = await this.WS.cryptoWithdraw({
                address: this.blockchain_address,
                amount: +this.converter_from_amount,
                verification_code,
                dry_run: 1,
            });
        } else {
            response_cashier = { error: { code: 'InvalidToken', message: 'Your token has expired or is invalid.' } };
        }

        if (response_cashier.error.code === 'InvalidToken') {
            this.config.withdraw.error.handleCashierError(response_cashier.error);
            this.setLoading(false);
            this.setSessionTimeout(true);
            this.clearTimeoutCashierUrl();
            if (verification_code) {
                // clear verification code on error
                this.config.withdraw.verification.clearVerification('payment_withdraw');
            }
        } else {
            this.setLoading(false);
        }
        if (this.config.withdraw.error) {
            this.config.withdraw.error.setErrorMessage(this.config.withdraw.error, this.onMountWithdraw);
        }
    }

    @action.bound
    async onMountDeposit(verification_code) {
        const current_container = this.active_container;

        this.config.deposit.error.setErrorMessage('');
        this.setContainerHeight(0);
        this.setLoading(true);

        if (!this.config[this.active_container].is_session_timeout) {
            this.checkIframeLoaded();
            return;
        }

        // if session has timed out reset everything
        this.setIframeUrl('');
        if (
            (this.active_container === this.config.withdraw.container && !verification_code) ||
            this.root_store.client.is_virtual
        ) {
            this.setLoading(false);
            // if virtual, clear everything and don't proceed further
            // if no verification code, we should request again
            return;
        }

        const response_cashier = await this.WS.authorized.cashier(this.active_container, { verification_code });

        // if tab changed while waiting for response, ignore it
        if (current_container !== this.active_container) {
            this.setLoading(false);
            return;
        }
        if (response_cashier.error) {
            this.config.deposit.error.handleCashierError(response_cashier.error);
            this.setLoading(false);
            this.setSessionTimeout(true);
            this.clearTimeoutCashierUrl();
            if (verification_code) {
                // clear verification code on error
                this.config.deposit.verification.clearVerification();
            }
        } else if (isCryptocurrency(this.root_store.client.currency)) {
            this.setLoading(false);
            this.setContainerHeight('540');
            this.setIframeUrl(response_cashier.cashier);
            // crypto cashier can only be accessed once and the session expires
            // so no need to set timeouts to keep the session alive
        } else {
            await this.checkIframeLoaded();
            this.setIframeUrl(response_cashier.cashier);
            this.setSessionTimeout(false);
            this.setTimeoutCashierUrl();
        }
    }

    @action.bound
    setNotificationCount(notification_count) {
        this.p2p_notification_count = notification_count;
    }

    @action.bound
    setIsP2pVisible(is_p2p_visible) {
        this.is_p2p_visible = is_p2p_visible;
        if (!is_p2p_visible && window.location.pathname.endsWith(routes.cashier_p2p)) {
            this.root_store.common.routeTo(routes.cashier_deposit);
        }
    }

    @action.bound
    async onMount(verification_code) {
        this.onRemount = this.onMount;
        await this.onMountCommon();

        if (this.containers.indexOf(this.active_container) === -1 && !this.root_store.client.is_switching) {
            throw new Error('Cashier Store onMount requires a valid container name.');
        }
        this.onMountDeposit(verification_code);
    }

    @computed
    get is_cashier_locked() {
        if (!this.root_store.client.account_status?.status) return false;
        const { status } = this.root_store.client.account_status;

        return status.some(status_name => status_name === 'cashier_locked');
    }

    @computed
    get is_system_maintenance() {
        if (!this.root_store.client.account_status?.cashier_validation) return false;
        const { cashier_validation } = this.root_store.client.account_status;

        return cashier_validation.some(validation => validation === 'system_maintenance');
    }

    @computed
    get is_deposit_locked() {
        const {
            is_authentication_needed,
            is_tnc_needed,
            is_financial_account,
            is_financial_information_incomplete,
            is_trading_experience_incomplete,
            account_status,
            is_eu,
            mt5_login_list,
            is_deposit_lock,
        } = this.root_store.client;
        if (!account_status?.status) return false;

        const need_authentication =
            this.config.deposit.error.is_ask_authentication || (is_authentication_needed && is_eu);
        const need_financial_assessment =
            is_financial_account && (is_financial_information_incomplete || is_trading_experience_incomplete);
        // CR can deposit without accepting latest tnc except those with Financial STP
        const need_tnc =
            (is_eu ||
                mt5_login_list.some(
                    item => item.account_type === 'real' && item.sub_account_type === 'financial_stp'
                )) &&
            is_tnc_needed;

        return (
            is_deposit_lock ||
            need_authentication ||
            need_tnc ||
            need_financial_assessment ||
            this.config.deposit.error.is_ask_financial_risk_approval
        );
    }

    @computed
    get is_withdrawal_locked() {
        if (!this.root_store.client.account_status?.status) return false;
        const { authentication } = this.root_store.client.account_status;
        const need_poi = authentication.needs_verification.includes('identity');

        const need_authentication = this.config.withdraw.error.is_ask_authentication && need_poi;

        return (
            this.root_store.client.is_withdrawal_lock ||
            need_authentication ||
            this.config.withdraw.error.is_ask_financial_risk_approval
        );
    }

    @computed
    get is_transfer_locked() {
        const {
            is_financial_account,
            is_financial_information_incomplete,
            is_trading_experience_incomplete,
            account_status,
        } = this.root_store.client;

        if (!account_status?.status) return false;

        const need_financial_assessment =
            is_financial_account && (is_financial_information_incomplete || is_trading_experience_incomplete);

        return need_financial_assessment && this.config.account_transfer.error.is_ask_financial_risk_approval;
    }

    @action.bound
    async check10kLimit() {
        const remainder = (await this.root_store.client.getLimits())?.get_limits?.remainder;
        const min_withdrawal = getMinWithdrawal(this.root_store.client.currency);
        const is_limit_reached = !!(typeof remainder !== 'undefined' && +remainder < min_withdrawal);
        this.set10kLimitation(is_limit_reached);
    }

    @action.bound
    set10kLimitation(is_limit_reached) {
        this.is_10k_withdrawal_limit_reached = is_limit_reached;
    }

    @action.bound
    async checkIframeLoaded() {
        this.removeOnIframeLoaded();
        this.config[this.active_container].onIframeLoaded = function (e) {
            if (/cashier|doughflow/.test(e.origin)) {
                this.setLoading(false);
                // set the height of the container after content loads so that the
                // loading bar stays vertically centered until the end
                if (this.root_store.ui.is_mobile) {
                    this.setContainerHeight(window.innerHeight - 100);
                } else {
                    this.setContainerHeight(window.innerHeight - 190);
                }
                // do not remove the listener
                // on every iframe screen change we need to update the height to more/less to match the new content
            }
        }.bind(this);
        window.addEventListener('message', this.config[this.active_container].onIframeLoaded, false);
    }

    removeOnIframeLoaded(container = this.active_container) {
        if (this.config[container].onIframeLoaded) {
            window.removeEventListener('message', this.config[container].onIframeLoaded, false);
            this.config[container].onIframeLoaded = '';
        }
    }

    @action.bound
    setIframeUrl(url, container = this.active_container) {
        if (url) {
            this.config[container].iframe_url = `${url}&theme=${this.root_store.ui.is_dark_mode_on ? 'dark' : 'light'}`;
            // after we set iframe url we can clear verification code
            this.root_store.client.setVerificationCode('', this.map_action[container]);
        } else {
            this.config[container].iframe_url = url;
        }
    }

    @action.bound
    setContainerHeight(height) {
        this.config[this.active_container].iframe_height = height;
    }

    @action.bound
    submitFundsProtection() {
        this.WS.send({ ukgc_funds_protection: 1, tnc_approval: 1 }).then(response => {
            if (response.error) {
                this.config.deposit.error.setMessage(response.error.message);
            } else {
                this.config.deposit.error.setIsAskUkFundsProtection(false);
                this.onMount();
            }
        });
    }

    @action.bound
    setLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setSessionTimeout(is_session_time_out, container = this.active_container) {
        this.config[container].is_session_timeout = is_session_time_out;
        if (is_session_time_out) {
            this.removeOnIframeLoaded(container);
        }
    }

    clearTimeoutCashierUrl(container = this.active_container) {
        if (this.config[container].timeout_session) {
            clearTimeout(this.config[container].timeout_session);
        }
    }

    // cashier session expires after one minute
    // so we should resend the request for container (deposit|withdraw) url on next mount
    @action.bound
    setTimeoutCashierUrl() {
        this.clearTimeoutCashierUrl();
        this.config[this.active_container].timeout_session = setTimeout(() => {
            this.setSessionTimeout(true);
        }, 60000);
    }

    @action.bound
    setIsTimerVisible(is_timer_visible) {
        this.is_timer_visible = is_timer_visible;
    }

    @action.bound
    resetTimer() {
        this.setIsTimerVisible(false);
    }

    @action.bound
    async getExchangeRate(from_currency, to_currency) {
        const { exchange_rates } = await this.WS.send({
            exchange_rates: 1,
            base_currency: from_currency,
        });
        return exchange_rates.rates[to_currency];
    }

    @action.bound
    setActiveTab(container) {
        this.active_container = container;
    }

    @action.bound
    async onMountPaymentAgentList() {
        this.setLoading(true);
        this.onRemount = this.onMountPaymentAgentList;
        await this.onMountCommon();

        this.setLoading(false);
    }

    // possible transfers:
    // 1. fiat to crypto & vice versa
    // 2. fiat to mt & vice versa
    // 3. crypto to mt & vice versa
    @action.bound
    async onMountAccountTransfer() {
        this.setLoading(true);
        this.onRemount = this.onMountAccountTransfer;
        await this.onMountCommon();
        await this.WS.wait('website_status');

        // check if some balance update has come in since the last mount
        const has_updated_account_balance =
            this.config.account_transfer.has_no_accounts_balance &&
            Object.keys(this.root_store.client.active_accounts).find(
                account =>
                    !this.root_store.client.active_accounts[account].is_virtual &&
                    this.root_store.client.active_accounts[account].balance
            );
        if (has_updated_account_balance) {
            this.setHasNoAccountsBalance(false);
        }

        // various issues happen when loading from cache
        // e.g. new account may have been created, transfer may have been done elsewhere, etc
        // so on load of this page just call it again
        if (this.root_store.client.is_logged_in) {
            const transfer_between_accounts = await this.WS.authorized.transferBetweenAccounts();

            if (transfer_between_accounts.error) {
                this.config.account_transfer.error.setErrorMessage(
                    transfer_between_accounts.error,
                    this.onMountAccountTransfer
                );
                this.setLoading(false);
                return;
            }

            if (!this.canDoAccountTransfer(transfer_between_accounts.accounts)) {
                return;
            }

            await this.sortAccountsTransfer(transfer_between_accounts);
            this.setTransferFee();
            this.setMinimumFee();
            this.setTransferLimit();

            if (this.config.account_transfer.accounts_list?.length > 0) {
                const cfd_transfer_to_login_id = sessionStorage.getItem('cfd_transfer_to_login_id');
                sessionStorage.removeItem('cfd_transfer_to_login_id');
                const obj_values = this.config.account_transfer.accounts_list.find(
                    account => account.value === cfd_transfer_to_login_id
                );
                if (obj_values) {
                    if (hasTransferNotAllowedLoginid(obj_values.value)) {
                        // check if selected to is not allowed account
                        obj_values.error = getSelectedError(obj_values.value);
                    }
                    this.setSelectedTo(obj_values);
                }
            }
        }
        this.setLoading(false);
    }

    canDoAccountTransfer(accounts) {
        let can_transfer = true;
        // should have at least one account with balance
        if (!accounts.find(account => +account.balance > 0)) {
            can_transfer = false;
            this.setHasNoAccountsBalance(true);
        } else {
            this.setHasNoAccountsBalance(false);
        }
        // should have at least two real-money accounts
        if (accounts.length <= 1) {
            can_transfer = false;
            this.setHasNoAccount(true);
        } else {
            this.setHasNoAccount(false);
        }
        if (!can_transfer) {
            this.setLoading(false);
        }
        return can_transfer;
    }

    @action.bound
    setHasNoAccountsBalance(has_no_accounts_balance) {
        this.config.account_transfer.has_no_accounts_balance = has_no_accounts_balance;
    }

    @action.bound
    setHasNoAccount(has_no_account) {
        this.config.account_transfer.has_no_account = has_no_account;
    }

    @action.bound
    setTransferFee() {
        const transfer_fee = getPropertyValue(getCurrencies(), [
            this.config.account_transfer.selected_from.currency,
            'transfer_between_accounts',
            'fees',
            this.config.account_transfer.selected_to.currency,
        ]);
        this.config.account_transfer.transfer_fee = typeof transfer_fee === 'undefined' ? 1 : +transfer_fee;
    }

    @action.bound
    setMinimumFee() {
        const decimals = getDecimalPlaces(this.config.account_transfer.selected_from.currency);
        // we need .toFixed() so that it doesn't display in scientific notation, e.g. 1e-8 for currencies with 8 decimal places
        this.config.account_transfer.minimum_fee = (1 / Math.pow(10, decimals)).toFixed(decimals);
    }

    @action.bound
    setTransferLimit() {
        const is_mt_transfer =
            this.config.account_transfer.selected_from.is_mt || this.config.account_transfer.selected_to.is_mt;
        const is_dxtrade_transfer =
            this.config.account_transfer.selected_from.is_dxtrade ||
            this.config.account_transfer.selected_to.is_dxtrade;

        let limits_key;
        if (is_mt_transfer) {
            limits_key = 'limits_mt5';
        } else if (is_dxtrade_transfer) {
            limits_key = 'limits_dxtrade';
        } else {
            limits_key = 'limits';
        }

        const transfer_limit = getPropertyValue(getCurrencies(), [
            this.config.account_transfer.selected_from.currency,
            'transfer_between_accounts',
            limits_key,
        ]);
        const balance = this.config.account_transfer.selected_from.balance;
        const decimal_places = getDecimalPlaces(this.config.account_transfer.selected_from.currency);
        // we need .toFixed() so that it doesn't display in scientific notation, e.g. 1e-8 for currencies with 8 decimal places
        this.config.account_transfer.transfer_limit = {
            max:
                !transfer_limit?.max || (+balance >= (transfer_limit?.min || 0) && +balance <= transfer_limit?.max)
                    ? balance
                    : transfer_limit?.max.toFixed(decimal_places),
            min: transfer_limit?.min ? (+transfer_limit?.min).toFixed(decimal_places) : null,
        };
    }

    @action.bound
    async sortAccountsTransfer(response_accounts) {
        const transfer_between_accounts = response_accounts || (await this.WS.authorized.transferBetweenAccounts());
        if (!this.config.account_transfer.accounts_list.length) {
            if (transfer_between_accounts.error) {
                return;
            }
        }

        const mt5_login_list = (await this.WS.storage.mt5LoginList())?.mt5_login_list;
        // TODO: move `tradingPlatformAccountsList` to deriv-api to use storage
        const dxtrade_accounts_list = (await this.WS.tradingPlatformAccountsList(CFD_PLATFORMS.DXTRADE))
            ?.trading_platform_accounts;

        // TODO: remove this temporary mapping when API adds market_type and sub_account_type to transfer_between_accounts
        const accounts = transfer_between_accounts.accounts.map(account => {
            if (account.account_type === CFD_PLATFORMS.MT5 && Array.isArray(mt5_login_list) && mt5_login_list.length) {
                // account_type in transfer_between_accounts (mt5|binary)
                // gets overridden by account_type in mt5_login_list (demo|real)
                // since in cashier all these are real accounts, the mt5 account type is what we want to keep
                const found_account = mt5_login_list.find(acc => acc.login === account.loginid);

                if (found_account === undefined) return account;

                return { ...account, ...found_account, account_type: CFD_PLATFORMS.MT5 };
            }
            if (
                account.account_type === CFD_PLATFORMS.DXTRADE &&
                Array.isArray(dxtrade_accounts_list) &&
                dxtrade_accounts_list.length
            ) {
                // account_type in transfer_between_accounts (mt5|binary)
                // gets overridden by account_type in dxtrade_accounts_list (demo|real)
                // since in cashier all these are real accounts, the mt5 account type is what we want to keep
                const found_account = dxtrade_accounts_list.find(acc => acc.account_id === account.loginid);

                if (found_account === undefined) return account;

                return { ...account, ...found_account, account_type: CFD_PLATFORMS.DXTRADE };
            }
            return account;
        });
        // sort accounts as follows:
        // for MT5, synthetic, financial, financial stp
        // for non-MT5, fiat, crypto (alphabetically by currency)
        // should have more than one account
        if (transfer_between_accounts.accounts.length > 1) {
            accounts.sort((a, b) => {
                const a_is_mt = a.account_type === CFD_PLATFORMS.MT5;
                const b_is_mt = b.account_type === CFD_PLATFORMS.MT5;
                const a_is_crypto = !a_is_mt && isCryptocurrency(a.currency);
                const b_is_crypto = !b_is_mt && isCryptocurrency(b.currency);
                const a_is_fiat = !a_is_mt && !a_is_crypto;
                const b_is_fiat = !b_is_mt && !b_is_crypto;
                if (a_is_mt && b_is_mt) {
                    if (a.market_type === 'gaming' || a.market_type === 'synthetic') {
                        return -1;
                    }
                    if (a.sub_account_type === 'financial') {
                        return b.market_type === 'gaming' || b.market_type === 'synthetic' ? 1 : -1;
                    }
                    return 1;
                } else if ((a_is_crypto && b_is_crypto) || (a_is_fiat && b_is_fiat)) {
                    return a.currency < b.currency ? -1 : 1;
                } else if ((a_is_crypto && b_is_mt) || (a_is_fiat && b_is_crypto) || (a_is_fiat && b_is_mt)) {
                    return -1;
                }
                return a_is_mt ? -1 : 1;
            });
        }
        const arr_accounts = [];
        this.setSelectedTo({}); // set selected to empty each time so we can redetermine its value on reload

        accounts.forEach(account => {
            const cfd_platforms = {
                mt5: { name: 'DMT5', icon: 'IcMt5' },
                dxtrade: { name: 'Deriv X', icon: 'IcDxtrade' },
            };
            const is_cfd = Object.keys(cfd_platforms).includes(account.account_type);
            const cfd_text_display = cfd_platforms[account.account_type]?.name;
            const cfd_icon_display = `${cfd_platforms[account.account_type]?.icon}-${getCFDAccount({
                market_type: account.market_type,
                sub_account_type: account.sub_account_type,
                platform: account.account_type,
                is_eu: this.root_store.client.is_eu,
            })}`;
            const account_text_display = is_cfd
                ? `${cfd_text_display} ${getCFDAccountDisplay({
                      market_type: account.market_type,
                      sub_account_type: account.sub_account_type,
                      platform: account.account_type,
                      is_eu: this.root_store.client.is_eu,
                  })}`
                : getCurrencyDisplayCode(
                      account.currency !== 'eUSDT' ? account.currency.toUpperCase() : account.currency
                  );

            const obj_values = {
                text: account_text_display,
                value: account.loginid,
                balance: account.balance,
                currency: account.currency,
                is_crypto: isCryptocurrency(account.currency),
                is_mt: account.account_type === CFD_PLATFORMS.MT5,
                is_dxtrade: account.account_type === CFD_PLATFORMS.DXTRADE,
                ...(is_cfd && {
                    platform_icon: cfd_icon_display,
                    market_type: getCFDAccount({
                        market_type: account.market_type,
                        sub_account_type: account.sub_account_type,
                        platform: account.account_type,
                        is_eu: this.root_store.client.is_eu,
                    }),
                }),
            };
            // set current logged in client as the default transfer from account
            if (account.loginid === this.root_store.client.loginid) {
                // check if selected from is not allowed account
                if (hasTransferNotAllowedLoginid(obj_values.value)) {
                    obj_values.error = getSelectedError(obj_values.value, true);
                }

                this.setSelectedFrom(obj_values);
            } else if (isEmptyObject(this.config.account_transfer.selected_to)) {
                if (hasTransferNotAllowedLoginid(obj_values.value)) {
                    // check if selected to is not allowed account
                    obj_values.error = getSelectedError(obj_values.value);
                }
                // set the first available account as the default transfer to account
                this.setSelectedTo(obj_values);
            }
            arr_accounts.push(obj_values);
        });
        this.setAccounts(arr_accounts);
    }

    @action.bound
    setSelectedFrom(obj_values) {
        this.config.account_transfer.selected_from = obj_values;
    }

    @action.bound
    setSelectedTo(obj_values) {
        this.config.account_transfer.selected_to = obj_values;
    }

    @action.bound
    setAccounts(arr_accounts) {
        this.config.account_transfer.accounts_list = arr_accounts;
    }

    @action.bound
    setIsTransferConfirm(is_transfer_confirm) {
        this.config[this.active_container].is_transfer_confirm = is_transfer_confirm;
    }

    @action.bound
    setAccountTransferAmount(amount) {
        this.config[this.active_container].account_transfer_amount = amount;
    }

    @action.bound
    setIsTransferSuccessful(is_transfer_successful) {
        this.config[this.active_container].setIsTransferSuccessful(is_transfer_successful);
    }

    @action.bound
    setIsMT5TransferInProgress(is_mt5_transfer_in_progress) {
        this.config[this.active_container].is_mt5_transfer_in_progress = is_mt5_transfer_in_progress;
    }

    @action.bound
    isMT5TransferInProgress() {
        return this.config[this.active_container]?.is_mt5_transfer_in_progress;
    }

    @action.bound
    setReceiptTransfer({ amount }) {
        this.config.account_transfer.receipt = {
            amount_transferred: amount,
        };
    }

    @action.bound
    onChangeTransferFrom({ target }) {
        this.config.account_transfer.error.setErrorMessage('');
        this.config.account_transfer.selected_from.error = '';

        const accounts = this.config.account_transfer.accounts_list;
        const selected_from = accounts.find(account => account.value === target.value);

        // if new value of selected_from is the same as the current selected_to
        // switch the value of selected_from and selected_to
        if (selected_from.value === this.config.account_transfer.selected_to.value) {
            this.onChangeTransferTo({ target: { value: this.config.account_transfer.selected_from.value } });
        } else if (
            (selected_from.is_mt && this.config.account_transfer.selected_to.is_mt) ||
            (selected_from.is_dxtrade && this.config.account_transfer.selected_to.is_dxtrade) ||
            (selected_from.is_dxtrade && this.config.account_transfer.selected_to.is_mt) ||
            (selected_from.is_mt && this.config.account_transfer.selected_to.is_dxtrade)
        ) {
            // not allowed to transfer from MT to MT
            // not allowed to transfer from Dxtrade to Dxtrade
            // not allowed to transfer between MT and Dxtrade
            const first_non_cfd = this.config.account_transfer.accounts_list.find(
                account => !account.is_mt && !account.is_dxtrade
            );
            this.onChangeTransferTo({ target: { value: first_non_cfd.value } });
        } else if (selected_from.is_crypto && this.config.account_transfer.selected_to.is_crypto) {
            // not allowed to transfer crypto to crypto
            const first_fiat = this.config.account_transfer.accounts_list.find(account => !account.is_crypto);
            this.onChangeTransferTo({ target: { value: first_fiat.value } });
        }

        if (hasTransferNotAllowedLoginid(selected_from.value)) {
            selected_from.error = getSelectedError(selected_from.value, true);
        }

        this.config.account_transfer.selected_from = selected_from;
        this.setTransferFee();
        this.setMinimumFee();
        this.setTransferLimit();
    }

    @action.bound
    onChangeTransferTo({ target }) {
        this.config.account_transfer.error.setErrorMessage('');
        this.config.account_transfer.selected_to.error = '';

        const accounts = this.config.account_transfer.accounts_list;
        this.config.account_transfer.selected_to = accounts.find(account => account.value === target.value) || {};
        if (hasTransferNotAllowedLoginid(this.config.account_transfer.selected_to.value)) {
            this.config.account_transfer.selected_to.error = getSelectedError(
                this.config.account_transfer.selected_to.value
            );
        }
        this.setTransferFee();
        this.setTransferLimit();
    }

    requestTransferBetweenAccounts = async ({ amount }) => {
        if (!this.root_store.client.is_logged_in) {
            return null;
        }

        this.setLoading(true);
        this.config.account_transfer.error.setErrorMessage('');

        const is_mt_transfer =
            this.config.account_transfer.selected_from.is_mt || this.config.account_transfer.selected_to.is_mt;

        if (is_mt_transfer) this.setIsMT5TransferInProgress(true);

        const currency = this.config.account_transfer.selected_from.currency;
        const transfer_between_accounts = await this.WS.authorized.transferBetweenAccounts(
            this.config.account_transfer.selected_from.value,
            this.config.account_transfer.selected_to.value,
            currency,
            amount
        );

        if (is_mt_transfer) this.setIsMT5TransferInProgress(false);

        if (transfer_between_accounts.error) {
            // if there is fiat2crypto transfer limit error, we need to refresh the account_status for authentication
            if (transfer_between_accounts.error.code === 'Fiat2CryptoTransferOverLimit') {
                const account_status_response = await this.WS.authorized.getAccountStatus();
                if (!account_status_response.error) {
                    this.root_store.client.setAccountStatus(account_status_response.get_account_status);
                }
            }
            this.config.account_transfer.error.setErrorMessage(transfer_between_accounts.error);
        } else {
            this.setReceiptTransfer({ amount: formatMoney(currency, amount, true) });
            transfer_between_accounts.accounts.forEach(account => {
                this.config.account_transfer.setBalanceByLoginId(account.loginid, account.balance);
                if (account.loginid === this.config.account_transfer.selected_from.value) {
                    this.config.account_transfer.setBalanceSelectedFrom(account.balance);
                } else if (account.loginid === this.config.account_transfer.selected_to.value) {
                    this.config.account_transfer.setBalanceSelectedTo(account.balance);
                }
                // if one of the accounts was mt5
                if (account.account_type === CFD_PLATFORMS.MT5) {
                    Promise.all([this.WS.mt5LoginList(), this.WS.balanceAll()]).then(
                        ([mt5_login_list_response, balance_response]) => {
                            // update the balance for account switcher by renewing the mt5_login_list response
                            this.root_store.client.responseMt5LoginList(mt5_login_list_response);
                            // update total balance since MT5 total only comes in non-stream balance call
                            this.root_store.client.setBalanceOtherAccounts(balance_response.balance);
                        }
                    );
                }
                // if one of the accounts was dxtrade
                if (account.account_type === CFD_PLATFORMS.DXTRADE) {
                    Promise.all([
                        this.WS.tradingPlatformAccountsList(CFD_PLATFORMS.DXTRADE),
                        this.WS.balanceAll(),
                    ]).then(([dxtrade_login_list_response, balance_response]) => {
                        // update the balance for account switcher by renewing the dxtrade_login_list_response
                        this.root_store.client.responseTradingPlatformAccountsList(dxtrade_login_list_response);
                        // update total balance since Dxtrade total only comes in non-stream balance call
                        this.root_store.client.setBalanceOtherAccounts(balance_response.balance);
                    });
                }
            });
            this.setAccountTransferAmount(null);
            this.setIsTransferConfirm(false);
            this.setIsTransferSuccessful(true);
        }
        this.setLoading(false);
        return transfer_between_accounts;
    };

    @action.bound
    resetAccountTransfer = async () => {
        this.setIsTransferSuccessful(false);
    };

    accountSwitcherListener() {
        [this.config.withdraw.container, this.root_store.modules.cashier?.payment_agent_store.container].forEach(
            container => {
                this.root_store.modules.cashier.verification_store.clearVerification(container);
            }
        );
        [this.config.deposit.container, this.config.withdraw.container].forEach(container => {
            this.setIframeUrl('', container);
            this.clearTimeoutCashierUrl(container);
            this.setSessionTimeout(true, container);
        });
        this.payment_agent = this.root_store.modules.cashier?.payment_agent_store;
        this.config.account_transfer = new ConfigAccountTransfer();
        this.config.payment_agent_transfer = this.root_store.modules.cashier?.payment_agent_transfer_store;
        this.is_populating_values = false;

        this.onRemount();

        return Promise.resolve();
    }

    @computed
    get account_platform_icon() {
        const platform_icon = this.root_store.client.account_list.find(
            acc => this.root_store.client.loginid === acc.loginid
        ).icon;

        return platform_icon;
    }

    @action.bound
    setConverterFromAmount(amount) {
        this.converter_from_amount = amount;
    }

    @action.bound
    setConverterToAmount(amount) {
        this.converter_to_amount = amount;
    }

    @action.bound
    setConverterFromError(error) {
        this.converter_from_error = error;
    }

    @action.bound
    setConverterToError(error) {
        this.converter_to_error = error;
    }

    @action.bound
    async onChangeConverterFromAmount({ target }, from_currency, to_currency) {
        this.resetTimer();
        if (target.value) {
            this.percentageSelectorSelectionStatus(true);
            this.calculatePercentage();
            this.setConverterFromAmount(target.value);
            this.validateFromAmount();
            if (this.converter_from_error) {
                this.setConverterToAmount('');
                this.setConverterToError('');
                this.setIsTimerVisible(false);
                this.setAccountTransferAmount('');
            } else {
                const rate = await this.getExchangeRate(from_currency, to_currency);
                const decimals = getDecimalPlaces(to_currency);
                const amount = (rate * target.value).toFixed(decimals);
                if (+amount || this.converter_from_amount) {
                    this.setConverterToAmount(amount);
                } else {
                    this.setConverterToAmount('');
                }
                this.validateToAmount();
                this.setConverterToError('');
                this.setIsTimerVisible(true);
                this.setAccountTransferAmount(target.value);
            }
        } else {
            this.resetConverter();
        }
    }

    @action.bound
    async onChangeConverterToAmount({ target }, from_currency, to_currency) {
        this.resetTimer();
        if (target.value) {
            this.percentageSelectorSelectionStatus(true);
            this.calculatePercentage();
            this.setConverterToAmount(target.value);
            this.validateToAmount();
            if (this.converter_to_error) {
                this.setConverterFromAmount('');
                this.setConverterFromError('');
                this.setIsTimerVisible(false);
                this.setAccountTransferAmount('');
            } else {
                const rate = await this.getExchangeRate(from_currency, to_currency);
                const decimals = getDecimalPlaces(to_currency);
                const amount = (rate * target.value).toFixed(decimals);
                if (+amount || this.converter_to_amount) {
                    this.setConverterFromAmount(amount);
                } else {
                    this.setConverterFromAmount('');
                }
                this.validateFromAmount();
                if (this.converter_from_error) {
                    this.setIsTimerVisible(false);
                    this.setAccountTransferAmount('');
                } else {
                    this.setConverterFromError('');
                    this.setIsTimerVisible(true);
                    this.setAccountTransferAmount(amount);
                }
            }
        } else {
            this.resetConverter();
        }
    }

    @action.bound
    setTransferPercentageSelectorResult(amount) {
        const selected_from_currency = this.config.account_transfer.selected_from.currency;
        const selected_to_currency = this.config.account_transfer.selected_to.currency;

        if (amount > 0 || +this.config.account_transfer.selected_from.balance === 0) {
            this.setConverterFromAmount(amount);
            this.validateTransferFromAmount();
            this.onChangeConverterFromAmount(
                { target: { value: amount } },
                selected_from_currency,
                selected_to_currency
            );
        }
        this.setIsTimerVisible(false);
        this.percentageSelectorSelectionStatus(false);
    }

    @action.bound
    setWithdrawPercentageSelectorResult(amount) {
        if (amount > 0) {
            this.setConverterFromAmount(amount);
            this.validateWithdrawFromAmount();
            this.onChangeConverterFromAmount(
                { target: { value: amount } },
                this.root_store.client.currency,
                this.root_store.client.current_fiat_currency || 'USD'
            );
        }
        this.setIsTimerVisible(false);
        this.percentageSelectorSelectionStatus(false);
    }

    @action.bound
    validateFromAmount() {
        if (this.active_container === this.config.account_transfer.container) {
            this.validateTransferFromAmount();
        } else {
            this.validateWithdrawFromAmount();
        }
    }

    @action.bound
    validateToAmount() {
        if (this.active_container === this.config.account_transfer.container) {
            this.validateTransferToAmount();
        } else {
            this.validateWithdrawToAmount();
        }
    }

    @action.bound
    validateTransferFromAmount() {
        if (!this.converter_from_amount) {
            this.setConverterFromError(localize('This field is required.'));
        } else {
            const { is_ok, message } = validNumber(this.converter_from_amount, {
                type: 'float',
                decimals: getDecimalPlaces(this.config.account_transfer.selected_from.currency),
                min: this.config.account_transfer.transfer_limit.min,
                max: this.config.account_transfer.transfer_limit.max,
            });
            if (!is_ok) {
                this.setConverterFromError(message);
            } else if (+this.config.account_transfer.selected_from.balance < +this.converter_from_amount) {
                this.setConverterFromError(localize('Insufficient funds'));
            } else {
                this.setConverterFromError('');
            }
        }
    }

    @action.bound
    validateTransferToAmount() {
        if (this.converter_to_amount) {
            const currency = this.config.account_transfer.selected_to.currency;
            const { is_ok, message } = validNumber(this.converter_to_amount, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
            });
            if (!is_ok) {
                this.setConverterToError(message);
            } else {
                this.setConverterToError('');
            }
        }
    }

    @action.bound
    validateWithdrawFromAmount() {
        let error_message = '';

        const { balance, currency, website_status } = this.root_store.client;
        const min_withdraw_amount = website_status.crypto_config[currency].minimum_withdrawal;

        if (this.converter_from_amount) {
            const { is_ok, message } = validNumber(this.converter_from_amount, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
            });
            if (!is_ok) error_message = message;

            if (+balance < +this.converter_from_amount) error_message = localize('Insufficient funds');

            if (+this.converter_from_amount < +min_withdraw_amount) {
                error_message = (
                    <Localize
                        i18n_default_text='The minimum withdrawal amount allowed is {{min_withdraw_amount}} {{currency}}'
                        values={{ min_withdraw_amount, currency: this.root_store.client.currency }}
                    />
                );
            }
        }
        this.setConverterFromError(error_message);
    }

    @action.bound
    validateWithdrawToAmount() {
        let error_message = '';
        const { current_fiat_currency } = this.root_store.client;

        if (this.converter_to_amount) {
            const { is_ok, message } = validNumber(this.converter_to_amount, {
                type: 'float',
                decimals: getDecimalPlaces(current_fiat_currency),
            });
            if (!is_ok) error_message = message;
        }

        this.setConverterToError(error_message);
    }

    @action.bound
    resetConverter() {
        this.setConverterFromAmount('');
        this.setConverterToAmount('');
        this.setConverterFromError('');
        this.setConverterToError('');
        this.setIsTimerVisible(false);
        this.percentageSelectorSelectionStatus(true);
    }
}
