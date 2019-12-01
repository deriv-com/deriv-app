import {
    action,
    observable,
    toJS }                 from 'mobx';
import CurrencyUtils       from 'deriv-shared/utils/currency';
import ObjectUtils         from 'deriv-shared/utils/object';
import BinarySocket        from '_common/base/socket_base';
import { localize }        from 'deriv-translations';
import { WS }              from 'Services';
import BaseStore           from '../../base-store';
import {
    getMT5AccountType,
    getMT5AccountDisplay } from '../../Helpers/client';

const bank_default_option = [{ text: localize('All payment agents'), value: 0 }];

class Config {
    container          = '';
    is_session_timeout = true;
    onIframeLoaded     = '';
    timeout_session    = '';

    @observable iframe_height = 0;
    @observable iframe_url    = '';

    constructor({ container }) {
        this.container = container;
    }
}

class ConfigError {
    @observable message           = '';
    @observable code              = '';
    @observable fields            = '';
    @observable is_show_full_page = false;
    @observable onClickButton     = null;
}

class ConfigPaymentAgent {
    list = [];

    @observable agents                 = [];
    @observable container              = 'payment_agent';
    @observable error                  = new ConfigError();
    @observable filtered_list          = [];
    @observable is_name_selected       = true;
    @observable is_withdraw            = false;
    @observable is_withdraw_successful = false;
    @observable receipt                = {};
    @observable selected_bank          = bank_default_option[0].value;
    @observable supported_banks        = bank_default_option;
    @observable verification           = new ConfigVerification();
}

class ConfigPaymentAgentTransfer {
    @observable container              = 'payment_agent_transfer';
    @observable error                  = new ConfigError();
    @observable is_payment_agent       = false;
    @observable is_transfer_successful = false;
    @observable receipt                = {};
    @observable transfer_limit         = {};
}

class ConfigAccountTransfer {
    @observable accounts_list           = [];
    @observable container               = 'account_transfer';
    @observable error                   = new ConfigError();
    @observable has_no_account          = false;
    @observable has_no_accounts_balance = false;
    @observable is_transfer_successful  = false;
    @observable minimum_fee             = null;
    @observable receipt                 = {};
    @observable selected_from           = {};
    @observable selected_to             = {};
    @observable transfer_fee            = null;
    @observable transfer_limit          = {};
}

class ConfigVerification {
    is_button_clicked = false;
    timeout_button    = '';

    @observable is_email_sent     = false;
    @observable is_resend_clicked = false;
    @observable resend_timeout    = 60;
}

export default class CashierStore extends BaseStore {
    @observable is_loading = false;

    @observable config = {
        account_transfer: new ConfigAccountTransfer(),
        deposit         : {
            ...(toJS(new Config({ container: 'deposit' }))),
            error: new ConfigError(),
        },
        payment_agent         : new ConfigPaymentAgent(),
        payment_agent_transfer: new ConfigPaymentAgentTransfer(),
        withdraw              : {
            ...(toJS(new Config({ container: 'withdraw' }))),
            error       : new ConfigError(),
            verification: new ConfigVerification(),
        },
    };

    active_container = this.config.deposit.container;
    current_client;

    containers = [
        this.config.deposit.container,
        this.config.withdraw.container,
    ];

    map_action = {
        [this.config.withdraw.container]     : 'payment_withdraw',
        [this.config.payment_agent.container]: 'payment_agent_withdraw',
    };

    @action.bound
    resetValuesIfNeeded() {
        if (this.current_client && this.current_client !== this.root_store.client.loginid) {
            this.onAccountSwitch();
        }
        this.current_client = this.root_store.client.loginid;
    }

    @action.bound
    async onMountCommon() {
        await BinarySocket.wait('authorize');
        this.resetValuesIfNeeded();

        // we need to see if client's country has PA
        // if yes, we can show the PA tab in cashier
        if (!this.config.payment_agent.list.length) {
            this.setPaymentAgentList().then(this.filterPaymentAgentList);
        }

        if (!this.config.payment_agent_transfer.is_payment_agent) {
            this.checkIsPaymentAgent();
        }

        if (!this.config.account_transfer.accounts_list.length) {
            this.sortAccountsTransfer();
        }
    }

    @action.bound
    async onMount(verification_code) {
        const current_container = this.active_container;
        await this.onMountCommon();

        if (this.containers.indexOf(this.active_container) === -1) {
            throw new Error('Cashier Store onMount requires a valid container name.');
        }
        this.setErrorMessage('');
        this.setContainerHeight(0);
        this.setLoading(true);

        if (!this.config[this.active_container].is_session_timeout) {
            this.checkIframeLoaded();
            return;
        }

        // if session has timed out reset everything
        this.setIframeUrl('');

        if (this.active_container === this.config.withdraw.container && !verification_code) {
            // if no verification code, we should request again
            return;
        }

        const response_cashier = await WS.cashier(this.active_container, verification_code);

        // if tab changed while waiting for response, ignore it
        if (current_container !== this.active_container) {
            return;
        }

        if (response_cashier.error) {
            this.setLoading(false);
            this.setErrorMessage(response_cashier.error);
            this.setSessionTimeout(true);
            this.clearTimeoutCashierUrl();
            if (verification_code) {
                // clear verification code on error
                this.clearVerification();
            }
        } else if (CurrencyUtils.isCryptocurrency(this.root_store.client.currency)) {
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
    async checkIframeLoaded() {
        this.removeOnIframeLoaded();
        this.config[this.active_container].onIframeLoaded = (function (e) {
            if (/cashier|doughflow/.test(e.origin)) {
                this.setLoading(false);
                // set the height of the container after content loads so that the
                // loading bar stays vertically centered until the end
                this.setContainerHeight(+e.data || '1200');
                // do not remove the listener
                // on every iframe screen change we need to update the height to more/less to match the new content
            }
        }).bind(this);
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
    setErrorMessage(error, onClickButton) {
        // for errors that need to show a button, reset the form
        this.config[this.active_container].error = {
            onClickButton,
            code             : error.code,
            message          : error.message,
            is_show_full_page: /InvalidToken|ASK_TNC_APPROVAL|ASK_FIX_DETAILS|WrongResponse/.test(error.code),
            ...(ObjectUtils.getPropertyValue(error, ['details', 'fields']) && {
                fields: error.details.fields,
            }),
        };
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

    @action.bound
    setVerificationButtonClicked(is_button_clicked, container = this.active_container) {
        this.config[container].verification.is_button_clicked = is_button_clicked;
    }

    @action.bound
    setVerificationEmailSent(is_email_sent, container = this.active_container) {
        this.config[container].verification.is_email_sent = is_email_sent;
    }

    @action.bound
    setVerificationResendClicked(is_resend_clicked, container = this.active_container) {
        this.config[container].verification.is_resend_clicked = is_resend_clicked;
    }

    @action.bound
    setVerificationResendTimeout(resend_timeout, container = this.active_container) {
        this.config[container].verification.resend_timeout = resend_timeout;
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

    clearTimeoutVerification(container = this.active_container) {
        if (this.config[container].verification.timeout_button) {
            clearTimeout(this.config[container].verification.timeout_button);
        }
    }

    // verification token expires after one hour
    // so we should show the verification request button again after that
    @action.bound
    setTimeoutVerification() {
        this.clearTimeoutVerification();
        this.config[this.active_container].verification.timeout_button = setTimeout(() => {
            this.clearVerification();
        }, 3600000);
    }

    @action.bound
    async sendVerificationEmail() {
        if (this.config[this.active_container].verification.is_button_clicked) {
            return;
        }

        this.setErrorMessage('');
        this.setVerificationButtonClicked(true);
        const withdrawal_type = `payment${this.active_container === this.config.payment_agent.container ? 'agent' : ''}_withdraw`;
        const response_verify_email = await WS.verifyEmail(this.root_store.client.email, withdrawal_type);

        if (response_verify_email.error) {
            this.clearVerification();
            this.setErrorMessage(response_verify_email.error);
        } else {
            this.setVerificationEmailSent(true);
            this.setTimeoutVerification();
        }
    }

    @action.bound
    resendVerificationEmail() {
        // don't allow clicking while ongoing timeout
        if (this.config[this.active_container].verification.resend_timeout < 60) {
            return;
        }
        this.setVerificationButtonClicked(false);
        this.setCountDownResendVerification();
        this.sendVerificationEmail();
    }

    setCountDownResendVerification() {
        this.setVerificationResendTimeout(this.config[this.active_container].verification.resend_timeout - 1);
        const resend_interval = setInterval(() => {
            if (this.config[this.active_container].verification.resend_timeout === 1) {
                this.setVerificationResendTimeout(60);
                clearInterval(resend_interval);
            } else {
                this.setVerificationResendTimeout(this.config[this.active_container].verification.resend_timeout - 1);
            }
        }, 1000);
    }

    clearVerification(container = this.active_container) {
        this.clearTimeoutVerification(container);
        this.setVerificationButtonClicked(false, container);
        this.setVerificationEmailSent(false, container);
        this.setVerificationResendClicked(false, container);
        this.setVerificationResendTimeout(60, container);
        this.root_store.client.setVerificationCode('', this.map_action[container]);
    }

    @action.bound
    setActiveTab(container) {
        this.active_container = container;
        // used to detect if old tabs with withdrawal tab open should be closed after verification token is opened in new tab
        this.root_store.ui.setCashierActiveTab(container);
    }

    @action.bound
    async onMountPaymentAgentList() {
        this.setLoading(true);
        await this.onMountCommon();

        if (!this.config.payment_agent.list.length) {
            const payment_agent_list = await BinarySocket.wait('paymentagent_list');
            if (!this.config.payment_agent.list.length) {
                this.setPaymentAgentList(payment_agent_list);
            }
        }

        this.filterPaymentAgentList();
        this.setLoading(false);
    }

    @action.bound
    async getPaymentAgentList() {
        const residence = this.root_store.client.accounts[this.root_store.client.loginid].residence;
        const currency  = this.root_store.client.currency;
        return WS.paymentAgentList(residence, currency);
    }

    @action.bound
    addSupportedBank(bank) {
        const supported_bank_exists =
            this.config.payment_agent.supported_banks.find(supported_bank =>
                supported_bank.value === bank.toLowerCase()
            );
        if (!supported_bank_exists) {
            this.config.payment_agent.supported_banks.push({ text: bank, value: bank.toLowerCase() });
        }
    }

    @action.bound
    async setPaymentAgentList(pa_list) {
        const payment_agent_list = pa_list || await this.getPaymentAgentList();
        if (!payment_agent_list || !payment_agent_list.paymentagent_list) {
            return;
        }
        payment_agent_list.paymentagent_list.list.forEach((payment_agent) => {
            this.config.payment_agent.list.push({
                email          : payment_agent.email,
                phone          : payment_agent.telephone,
                name           : payment_agent.name,
                supported_banks: payment_agent.supported_banks,
                url            : payment_agent.url,
            });
            if (payment_agent.supported_banks) {
                payment_agent.supported_banks.split(',').forEach((bank) => {
                    this.addSupportedBank(bank);
                });
            }
        });

        // sort supported banks alphabetically by value, the option 'All payment agents' with value 0 should be on top
        this.config.payment_agent.supported_banks.replace(
            this.config.payment_agent.supported_banks.slice().sort(function(a, b){
                if (a.value < b.value) { return -1; }
                if (a.value > b.value) { return 1; }
                return 0;
            })
        );
    }

    @action.bound
    filterPaymentAgentList(bank) {
        if (bank) {
            this.config.payment_agent.filtered_list = [];
            this.config.payment_agent.list.forEach((payment_agent) => {
                if (payment_agent.supported_banks && payment_agent.supported_banks.toLowerCase().split(',').indexOf(bank) !== -1) {
                    this.config.payment_agent.filtered_list.push(payment_agent);
                }
            });
        } else {
            this.config.payment_agent.filtered_list = this.config.payment_agent.list;
        }
    }

    @action.bound
    onChangePaymentMethod({ target }) {
        this.config.payment_agent.selected_bank = target.value;
        this.filterPaymentAgentList(target.value);
    }

    @action.bound
    async onMountPaymentAgentWithdraw() {
        this.setLoading(true);
        await this.onMountCommon();

        this.setIsWithdraw(true);
        this.setIsWithdrawSuccessful(false);
        this.setReceipt({});

        if (!this.config.payment_agent.list.length) {
            const payment_agent_list = await this.getPaymentAgentList();
            payment_agent_list.paymentagent_list.list.forEach((payment_agent) => {
                this.addPaymentAgent(payment_agent);
            });
        }

        this.setLoading(false);
    }

    @action.bound
    setIsWithdraw(is_withdraw = !this.config.payment_agent.is_withdraw) {
        this.config.payment_agent.is_withdraw = is_withdraw;
    }

    @action.bound
    setIsWithdrawSuccessful(is_withdraw_successful) {
        this.config.payment_agent.is_withdraw_successful = is_withdraw_successful;
    }

    @action.bound
    setReceipt({
        amount_transferred,
        payment_agent_email,
        payment_agent_id,
        payment_agent_name,
        payment_agent_phone,
        payment_agent_url,
    }) {
        this.config.payment_agent.receipt = {
            amount_transferred,
            payment_agent_email,
            payment_agent_id,
            payment_agent_name,
            payment_agent_phone,
            payment_agent_url,
        };
    }

    @action.bound
    addPaymentAgent(payment_agent) {
        this.config.payment_agent.agents.push({
            text          : payment_agent.name,
            value         : payment_agent.paymentagent_loginid,
            max_withdrawal: payment_agent.max_withdrawal,
            min_withdrawal: payment_agent.min_withdrawal,
            email         : payment_agent.email,
            phone         : payment_agent.telephone,
            url           : payment_agent.url,
        });
    }

    @action.bound
    async requestPaymentAgentWithdraw({ loginid, currency, amount, verification_code }) {
        const payment_agent_withdraw = await WS.paymentAgentWithdraw({ loginid, currency, amount, verification_code });
        if (+payment_agent_withdraw.paymentagent_withdraw === 1) {
            const selected_agent = this.config.payment_agent.agents.find((agent) => agent.value === loginid);
            this.setReceipt({
                amount_transferred: CurrencyUtils.formatMoney(currency, amount, true),
                ...(selected_agent && {
                    payment_agent_email: selected_agent.email,
                    payment_agent_id   : selected_agent.value,
                    payment_agent_name : selected_agent.text,
                    payment_agent_phone: selected_agent.phone,
                    payment_agent_url  : selected_agent.url,
                }),
                ...(!selected_agent && {
                    payment_agent_id: loginid,
                }),
            });
            this.setIsWithdrawSuccessful(true);
        } else {
            this.setErrorMessage(payment_agent_withdraw.error, this.resetPaymentAgent);
        }
    }

    @action.bound
    resetPaymentAgent = () => {
        this.setErrorMessage('');
        this.setIsWithdraw(false);
        this.clearVerification();
    };

    // possible transfers:
    // 1. fiat to crypto & vice versa
    // 2. fiat to mt & vice versa
    // 3. crypto to mt & vice versa
    @action.bound
    async onMountAccountTransfer() {
        this.setLoading(true);
        await this.onMountCommon();
        await BinarySocket.wait('website_status');

        // check if some balance update has come in since the last mount
        const has_updated_account_balance = this.config.account_transfer.has_no_accounts_balance &&
            Object.keys(this.root_store.client.active_accounts).find(account =>
                !this.root_store.client.active_accounts[account].is_virtual &&
                this.root_store.client.active_accounts[account].balance
            );
        if (has_updated_account_balance) {
            this.setHasNoAccountsBalance(false);
        }

        if (!this.config.account_transfer.accounts_list.length || has_updated_account_balance) {
            const transfer_between_accounts = await WS.transferBetweenAccounts();
            if (transfer_between_accounts.error) {
                this.setErrorMessage(transfer_between_accounts.error, this.onMountAccountTransfer);
                this.setLoading(false);
                return;
            }
            if (!this.canDoAccountTransfer(transfer_between_accounts.accounts)) {
                return;
            }
            this.sortAccountsTransfer(transfer_between_accounts);
        } else if (!this.canDoAccountTransfer(this.config.account_transfer.accounts_list)) {
            return;
        }
        this.setTransferFee();
        this.setMinimumFee();
        this.setTransferLimit();
        this.setLoading(false);
    }

    canDoAccountTransfer(accounts) {
        let can_transfer = true;
        // should have at least one account with balance
        if (!accounts.find(account => +account.balance > 0)) {
            can_transfer = false;
            this.setHasNoAccountsBalance(true);
        }
        // should have at least two real-money accounts
        if (accounts.length <= 1) {
            can_transfer = false;
            this.setHasNoAccount(true);
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
        const transfer_fee = ObjectUtils.getPropertyValue(CurrencyUtils.getCurrencies(), [this.config.account_transfer.selected_from.currency, 'transfer_between_accounts', 'fees', this.config.account_transfer.selected_to.currency]);
        this.config.account_transfer.transfer_fee = typeof transfer_fee === 'undefined' ? 1 : +transfer_fee;
    }

    @action.bound
    setMinimumFee() {
        const decimals = CurrencyUtils.getDecimalPlaces(this.config.account_transfer.selected_from.currency);
        // we need .toFixed() so that it doesn't display in scientific notation, e.g. 1e-8 for currencies with 8 decimal places
        this.config.account_transfer.minimum_fee = (1 / Math.pow(10, decimals)).toFixed(decimals);
    }

    @action.bound
    setTransferLimit() {
        const transfer_limit = ObjectUtils.getPropertyValue(CurrencyUtils.getCurrencies(), [this.config.account_transfer.selected_from.currency, 'transfer_between_accounts', 'limits']);
        const decimal_places = CurrencyUtils.getDecimalPlaces(this.config.account_transfer.selected_from.currency);
        // we need .toFixed() so that it doesn't display in scientific notation, e.g. 1e-8 for currencies with 8 decimal places
        this.config.account_transfer.transfer_limit = {
            max: transfer_limit.max ? transfer_limit.max.toFixed(decimal_places) : null,
            min: transfer_limit.min ? transfer_limit.min.toFixed(decimal_places) : null,
        };
    }

    @action.bound
    async sortAccountsTransfer(response_accounts) {
        const transfer_between_accounts = response_accounts || await WS.transferBetweenAccounts();
        if (!this.config.account_transfer.accounts_list.length) {
            // should have more than one account
            if (transfer_between_accounts.error ||
                transfer_between_accounts.accounts.length <= 1) {
                return;
            }
        }
        const accounts = transfer_between_accounts.accounts;
        // sort accounts as follows:
        // for non-MT5, top is fiat, then crypto, alphabetically by currency
        // for MT5, standard, advanced, then synthetic indices
        accounts.sort((a, b) => {
            const a_is_mt = a.account_type === 'mt5';
            const b_is_mt = b.account_type === 'mt5';
            const a_is_crypto = !a_is_mt && CurrencyUtils.isCryptocurrency(a.currency);
            const b_is_crypto = !b_is_mt && CurrencyUtils.isCryptocurrency(b.currency);
            const a_is_fiat = !a_is_mt && !a_is_crypto;
            const b_is_fiat = !b_is_mt && !b_is_crypto;
            if (a_is_mt && b_is_mt) {
                if (/vanuatu/.test(a.mt5_group)) {
                    return -1;
                }
                if (/svg/.test(a.mt5_group)) {
                    return 1;
                }
                return -1;
            } else if ((a_is_crypto && b_is_crypto) || (a_is_fiat && b_is_fiat)) {
                return a.currency < b.currency ? -1 : 1;
            } else if ((a_is_crypto && b_is_mt) || (a_is_fiat && b_is_crypto) || (a_is_fiat && b_is_mt)) {
                return -1;
            }
            return 1;
        });
        const arr_accounts = [];
        accounts.forEach((account, idx) => {
            const obj_values = {
                text     : account.mt5_group ? getMT5AccountDisplay(account.mt5_group) : account.currency.toUpperCase(),
                value    : account.loginid,
                balance  : account.balance,
                currency : account.currency,
                is_crypto: CurrencyUtils.isCryptocurrency(account.currency),
                is_mt    : account.account_type === 'mt5',
                ...(account.mt5_group && { mt_icon: getMT5AccountType(account.mt5_group) }),
            };
            if (idx === 0) {
                this.setSelectedFrom(obj_values);
            } else if (idx === 1) {
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
    setIsTransferSuccessful(is_transfer_successful) {
        this.config[this.active_container].is_transfer_successful = is_transfer_successful;
    }

    @action.bound
    setReceiptTransfer({ amount }) {
        this.config.account_transfer.receipt = {
            amount_transferred: amount,
        };
    }

    @action.bound
    onChangeTransferFrom({ target }) {
        this.setErrorMessage('');

        const accounts      = this.config.account_transfer.accounts_list;
        const selected_from = accounts.find(account => account.value === target.value);

        // if new value of selected_from is the same as the current selected_to
        // switch the value of selected_from and selected_to
        if (selected_from.value === this.config.account_transfer.selected_to.value) {
            this.onChangeTransferTo({ target: { value: this.config.account_transfer.selected_from.value } });
        } else if (selected_from.is_mt && this.config.account_transfer.selected_to.is_mt) { // not allowed to transfer from MT to MT
            this.onChangeTransferTo({ target: { value: this.config.account_transfer.accounts_list[0].value } });
        } else if (selected_from.is_crypto && this.config.account_transfer.selected_to.is_crypto) { // not allowed to transfer crypto to crypto
            const first_fiat = this.config.account_transfer.accounts_list.find((account) => !account.is_crypto);
            this.onChangeTransferTo({ target: { value: first_fiat.value } });
        }

        this.config.account_transfer.selected_from = selected_from;
        this.setMinimumFee();
        this.setTransferLimit();
    }

    @action.bound
    onChangeTransferTo({ target }) {
        this.setErrorMessage('');

        const accounts = this.config.account_transfer.accounts_list;
        this.config.account_transfer.selected_to = accounts.find(account => account.value === target.value) || {};
        this.setTransferFee();
    }

    requestTransferBetweenAccounts = async ({ amount }) => {
        this.setErrorMessage('');
        const currency = this.config.account_transfer.selected_from.currency;
        const transfer_between_accounts = await WS.transferBetweenAccounts(
            this.config.account_transfer.selected_from.value,
            this.config.account_transfer.selected_to.value,
            currency,
            amount,
        );
        if (transfer_between_accounts.error) {
            this.setErrorMessage(transfer_between_accounts.error);
        } else {
            this.setReceiptTransfer({ amount: CurrencyUtils.formatMoney(currency, amount, true) });
            transfer_between_accounts.accounts.forEach((account) => {
                this.config.account_transfer.accounts_list.find(acc => account.loginid === acc.value)
                    .balance = account.balance;
                if (account.loginid === this.config.account_transfer.selected_from.value) {
                    this.config.account_transfer.selected_from.balance = account.balance;
                } else if (account.loginid === this.config.account_transfer.selected_to.value) {
                    this.config.account_transfer.selected_to.balance = account.balance;
                }
                // if one of the accounts was mt5
                if (account.mt5_group) {
                    // update the balance for account switcher by renewing the mt5_login_list response
                    WS.mt5LoginList().then(this.root_store.client.responseMt5LoginList);
                    // update total balance since MT5 total only comes in non-stream balance call
                    WS.balanceAll().then((response) => {
                        this.root_store.client.setBalance(response.balance);
                    });
                }
            });
            this.setIsTransferSuccessful(true);
        }
        return transfer_between_accounts;
    };

    @action.bound
    resetAccountTransfer = () => {
        this.setIsTransferSuccessful(false);
    };

    @action.bound
    async onMountPaymentAgentTransfer() {
        this.setLoading(true);
        await this.onMountCommon();

        if (!this.config.payment_agent_transfer.transfer_limit.min_withdrawal) {
            const response = await BinarySocket.wait('paymentagent_list');
            const current_payment_agent = this.getCurrentPaymentAgent(response);
            this.setMinMaxPaymentAgentTransfer(current_payment_agent);
        }
        this.setLoading(false);
    }

    getCurrentPaymentAgent(response_payment_agent) {
        return response_payment_agent.paymentagent_list.list.find((agent) =>
            agent.paymentagent_loginid === this.root_store.client.loginid
        ) || {};
    }

    async checkIsPaymentAgent() {
        const get_settings = (await WS.authorized.storage.getSettings()).get_settings;
        this.setIsPaymentAgent(get_settings.is_authenticated_payment_agent);
    }

    @action.bound
    setIsPaymentAgent(is_payment_agent) {
        this.config.payment_agent_transfer.is_payment_agent = !!is_payment_agent;
    }

    @action.bound
    setMinMaxPaymentAgentTransfer({ min_withdrawal, max_withdrawal }) {
        this.config.payment_agent_transfer.transfer_limit = {
            min: min_withdrawal,
            max: max_withdrawal,
        };
    }

    @action.bound
    setReceiptPaymentAgentTransfer({ amount_transferred, client_id, client_name }) {
        this.config.payment_agent_transfer.receipt = {
            amount_transferred,
            client_id,
            client_name,
        };
    }

    @action.bound
    requestPaymentAgentTransfer = async ({ amount, currency, description, transfer_to }) => {
        const payment_agent_transfer = await WS.paymentAgentTransfer({ amount, currency, description, transfer_to });
        if (+payment_agent_transfer.paymentagent_transfer === 1) {
            this.setReceiptPaymentAgentTransfer({
                amount_transferred: amount,
                client_id         : transfer_to,
                client_name       : payment_agent_transfer.client_to_full_name,
            });
            this.setIsTransferSuccessful(true);
        } else {
            this.setErrorMessage(payment_agent_transfer.error, this.resetPaymentAgentTransfer);
        }

        return payment_agent_transfer;
    };

    @action.bound
    resetPaymentAgentTransfer = () => {
        this.setIsTransferSuccessful(false);
        this.setErrorMessage('');
    };

    onAccountSwitch() {
        [this.config.withdraw.container, this.config.payment_agent.container].forEach((container) => {
            this.clearVerification(container);
        });
        [this.config.deposit.container, this.config.withdraw.container].forEach((container) => {
            this.setIframeUrl('', container);
            this.clearTimeoutCashierUrl(container);
            this.setSessionTimeout(true, container);
        });
        this.config.payment_agent = new ConfigPaymentAgent();
        this.config.account_transfer = new ConfigAccountTransfer();
        this.config.payment_agent_transfer = new ConfigPaymentAgentTransfer();
    }
}
