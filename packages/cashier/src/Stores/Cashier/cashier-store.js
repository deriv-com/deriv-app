/* eslint-disable max-classes-per-file */
import React from 'react';
import { action, computed, observable, toJS, reaction, when } from 'mobx';
import {
    isCryptocurrency,
    getDecimalPlaces,
    getMinWithdrawal,
    getPropertyValue,
    routes,
    validNumber,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import CashierNotifications from 'Containers/cashier-notifications.jsx';
import BaseStore from '../base-store';
import VerificationStore from '../verification-store';
import ErrorStore from '../error-store';

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

        when(
            () => this.root_store.client.is_logged_in,
            () => {
                this.setHasSetCurrency();

                this.root_store.menu.attach({
                    id: 'dt_cashier_tab',
                    icon: <CashierNotifications p2p_notification_count={this.p2p_notification_count} />,
                    text: () => localize('Cashier'),
                    link_to: this.has_set_currency && routes.cashier,
                    onClick: !this.has_set_currency && this.root_store.ui.toggleSetCurrencyModal,
                    login_only: true,
                });
            }
        );

        if (!this.has_set_currency) {
            this.changeSetCurrencyModalTitle();
        }

        this.init();
    }

    @observable is_loading = false;
    @observable is_p2p_visible = false;
    @observable p2p_notification_count = 0;
    @observable cashier_route_tab_index = 0;
    @observable is_10k_withdrawal_limit_reached = undefined;
    @observable is_deposit = false;
    @observable should_show_all_available_currencies = false;
    @observable is_cashier_default = true;
    @observable deposit_target = '';
    @observable crypto_amount = '';
    @observable fiat_amount = '';
    @observable insufficient_fund_error = '';
    @observable should_set_currency_modal_title_change = false;
    @observable p2p_advertiser_error = undefined;
    @observable has_set_currency = false;
    @observable withdraw_amount = '';
    @observable blockchain_address = '';
    @observable should_percentage_reset = false;
    @observable percentage = 0;
    @observable is_withdraw_confirmed = false;

    @observable config = {
        account_transfer: this.root_store.modules.cashier?.account_transfer_store,
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
    get is_p2p_enabled() {
        return this.is_p2p_visible && !this.root_store.client.is_eu;
    }

    @action.bound
    setHasSetCurrency() {
        this.has_set_currency = this.root_store.client.account_list
            .filter(account => !account.is_virtual)
            .some(account => account.title !== 'Real');
    }

    @action.bound
    changeSetCurrencyModalTitle() {
        this.should_set_currency_modal_title_change = true;
    }

    @action.bound
    async onMountCashierDefault() {
        this.setIsCashierDefault(true);
        this.root_store.modules.cashier.account_prompt_dialog_store.resetIsConfirmed();

        this.setLoading(true);
        if (
            this.root_store.modules.cashier.payment_agent_store.all_payment_agent_list?.paymentagent_list?.list ===
            undefined
        ) {
            const agent_list = await this.root_store.modules.cashier.payment_agent_store.getAllPaymentAgentList();
            this.root_store.modules.cashier.payment_agent_store.setAllPaymentAgentList(agent_list);
        }
        this.setLoading(false);
    }

    @action.bound
    setIsWithdrawConfirmed(is_withdraw_confirmed) {
        this.is_withdraw_confirmed = is_withdraw_confirmed;

        if (is_withdraw_confirmed)
            this.setWithdrawAmount(this.root_store.modules.cashier.account_transfer_store.converter_from_amount);

        if (!is_withdraw_confirmed && this.config[this.active_container]?.verification) {
            this.config.withdraw.verification.clearVerification('payment_withdraw');
        }
    }

    @action.bound
    setWithdrawAmount(amount) {
        this.withdraw_amount = amount;
    }

    @action.bound
    calculatePercentage(amount = this.root_store.modules.cashier.account_transfer_store.converter_from_amount) {
        if (this.active_container === this.root_store.modules.cashier.account_transfer_store.container) {
            this.percentage = +(
                (amount / +this.root_store.modules.cashier.account_transfer_store.selected_from.balance) *
                100
            ).toFixed(0);
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
            amount: +this.root_store.modules.cashier.account_transfer_store.converter_from_amount,
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

        if (!this.root_store.modules.cashier.account_transfer_store.converter_from_amount) {
            this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterFromError(
                localize('This field is required.')
            );
            return;
        }

        await this.WS.cryptoWithdraw({
            address: this.blockchain_address,
            amount: +this.root_store.modules.cashier.account_transfer_store.converter_from_amount,
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
        this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterFromAmount('');
        this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterToAmount('');
        this.config.withdraw.verification.clearVerification('payment_withdraw');
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
    setBlockchainAddress(address) {
        this.blockchain_address = address;
    }

    @action.bound
    setIsCashierDefault(is_cashier_default) {
        this.is_cashier_default = is_cashier_default;
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
    init() {
        when(
            () => this.root_store.client.is_logged_in,
            async () => {
                await this.getAdvertizerError();
                this.checkP2pStatus();
            }
        );
        when(
            () => this.is_payment_agent_visible,
            () => this.filterPaymentAgentList()
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
                    await this.getAdvertizerError();
                    this.root_store.modules.cashier.account_prompt_dialog_store.resetLastLocation();
                    if (!this.root_store.client.switched) this.checkP2pStatus();
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
    async getAdvertizerError() {
        const advertiser_info = await this.WS.authorized.p2pAdvertiserInfo();
        this.p2p_advertiser_error = getPropertyValue(advertiser_info, ['error', 'code']);
    }

    @action.bound
    checkP2pStatus() {
        const advertiser_error = this.p2p_advertiser_error;
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

            if (!this.root_store.modules.cashier?.account_transfer_store.accounts_list.length) {
                this.root_store.modules.cashier?.account_transfer_store.sortAccountsTransfer();
            }

            if (
                !this.root_store.modules.cashier.onramp.is_onramp_tab_visible &&
                window.location.pathname.endsWith(routes.cashier_onramp)
            ) {
                this.root_store.common.routeTo(routes.cashier_deposit);
            }

            if (
                !this.root_store.modules.cashier.transaction_history.is_crypto_transactions_visible &&
                window.location.pathname.endsWith(routes.cashier_crypto_transactions)
            ) {
                this.root_store.common.routeTo(routes.cashier_deposit);
                this.root_store.modules.cashier.transaction_history.setIsCryptoTransactionsVisible(true);
                this.root_store.modules.cashier.transaction_history.onMount();
            }
        }
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
                amount: +this.root_store.modules.cashier.account_transfer_store.converter_from_amount,
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
            this.setContainerHeight('380');
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
            this.root_store.common.routeTo(
                this.root_store.modules.cashier.account_prompt_dialog_store.last_location ?? routes.cashier_deposit
            );
        }
    }

    @action.bound
    async onMount(verification_code) {
        this.onRemount = this.onMount;
        await this.onMountCommon();

        if (
            this.containers.indexOf(this.active_container) === -1 &&
            !this.root_store.client.is_switching &&
            this.active_container !== this.root_store.modules.cashier.payment_agent_store.container
        ) {
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
    setActiveTab(container) {
        this.active_container = container;
    }

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
        this.config.account_transfer = this.root_store.modules.cashier?.account_transfer_store;
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
    setWithdrawPercentageSelectorResult(amount) {
        if (amount > 0) {
            this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterFromAmount(amount);
            this.validateWithdrawFromAmount();
            this.root_store.modules.cashier.crypto_fiat_converter_store.onChangeConverterFromAmount(
                { target: { value: amount } },
                this.root_store.client.currency,
                this.root_store.client.current_fiat_currency || 'USD'
            );
        }
        this.setIsTimerVisible(false);
        this.percentageSelectorSelectionStatus(false);
    }

    @action.bound
    validateWithdrawFromAmount() {
        let error_message = '';

        const { balance, currency, website_status } = this.root_store.client;
        const min_withdraw_amount = website_status.crypto_config[currency].minimum_withdrawal;

        if (this.root_store.modules.cashier.account_transfer_store.converter_from_amount) {
            const { is_ok, message } = validNumber(
                this.root_store.modules.cashier.account_transfer_store.converter_from_amount,
                {
                    type: 'float',
                    decimals: getDecimalPlaces(currency),
                }
            );
            if (!is_ok) error_message = message;

            if (+balance < +this.root_store.modules.cashier.account_transfer_store.converter_from_amount)
                error_message = localize('Insufficient funds');

            if (+this.root_store.modules.cashier.account_transfer_store.converter_from_amount < +min_withdraw_amount) {
                error_message = (
                    <Localize
                        i18n_default_text='The minimum withdrawal amount allowed is {{min_withdraw_amount}} {{currency}}'
                        values={{ min_withdraw_amount, currency: this.root_store.client.currency }}
                    />
                );
            }
        }
        this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterFromError(error_message);
    }

    @action.bound
    validateWithdrawToAmount() {
        let error_message = '';
        const { current_fiat_currency } = this.root_store.client;

        if (this.root_store.modules.cashier.crypto_fiat_converter_store.converter_to_amount) {
            const { is_ok, message } = validNumber(
                this.root_store.modules.cashier.crypto_fiat_converter_store.converter_to_amount,
                {
                    type: 'float',
                    decimals: getDecimalPlaces(current_fiat_currency),
                }
            );
            if (!is_ok) error_message = message;
        }

        this.root_store.modules.cashier.crypto_fiat_converter_store.setConverterToError(error_message);
    }
}
