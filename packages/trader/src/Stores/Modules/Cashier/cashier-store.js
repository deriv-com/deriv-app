import {
    action,
    observable }            from 'mobx';
import { isCryptocurrency } from '_common/base/currency_base';
import { WS }               from 'Services';
import BaseStore            from '../../base-store';

class Config {
    container          = '';
    is_session_timeout = true;
    onIframeLoaded     = '';
    timeout_session    = '';

    @observable error_message = '';
    @observable iframe_height = 0;
    @observable iframe_url    = '';

    constructor({ container }) {
        this.container = container;
    }
}

export default class CashierStore extends BaseStore {
    @observable is_loading = false;

    @observable config = {
        deposit     : new Config({ container: 'deposit' }),
        verification: {
            is_button_clicked: false,
            is_email_sent    : false,
            is_resend_clicked: false,
            resend_timeout   : 60,
            timeout_button   : '',
        },
        withdraw: new Config({ container: 'withdraw' }),
    };

    containers = [
        this.config.deposit.container,
        this.config.withdraw.container,
    ];

    constructor({ root_store }) {
        super({ root_store });

        this.onSwitchAccount(this.accountSwitcherListener);
    }

    @action.bound
    async onMount(current_action, verification_code) {
        if (this.containers.indexOf(current_action) === -1) {
            throw new Error('Cashier Store onMount requires a valid container name.');
        }
        this.setErrorMessage('', current_action);
        this.setContainerHeight(0, current_action);
        this.setLoading(true);

        if (!this.config[current_action].is_session_timeout) {
            this.checkIframeLoaded(current_action);
            return;
        }

        // if session has timed out reset everything
        this.setIframeUrl('', current_action);

        if (current_action === this.config.withdraw.container && !verification_code) {
            // if no verification code, we should request again
            return;
        }

        const response_cashier = await WS.cashier(current_action, verification_code);

        // TODO: error handling UI & custom messages
        if (response_cashier.error) {
            this.setLoading(false);
            this.setErrorMessage(response_cashier.error.message, current_action);
            this.setSessionTimeout(true, current_action);
            this.clearTimeoutCashierUrl(current_action);
            if (verification_code) {
                // clear verification code on error
                this.clearVerification();
            }
        } else if (isCryptocurrency(this.root_store.client.currency)) {
            this.setLoading(false);
            this.setContainerHeight('700', current_action);
            this.setIframeUrl(response_cashier.cashier, current_action);
            // crypto cashier can only be accessed once and the session expires
            // so no need to set timeouts to keep the session alive
        } else {
            await this.checkIframeLoaded(current_action);
            this.setIframeUrl(response_cashier.cashier, current_action);
            this.setSessionTimeout(false, current_action);
            this.setTimeoutCashierUrl(current_action);
        }
    }

    @action.bound
    async onMountDeposit() {
        await this.onMount(this.config.deposit.container);
    }

    @action.bound
    async checkIframeLoaded(container) {
        this.removeOnIframeLoaded(container);
        this.config[container].onIframeLoaded = (function (e) {
            if (/cashier|doughflow/.test(e.origin)) {
                this.setLoading(false);
                // set the height of the container after content loads so that the
                // loading bar stays vertically centered until the end
                this.setContainerHeight(+e.data || '1200', container);
                // do not remove the listener
                // on every iframe screen change we need to update the height to more/less to match the new content
            }
        }).bind(this);
        window.addEventListener('message', this.config[container].onIframeLoaded, false);
    }

    removeOnIframeLoaded(container) {
        if (this.config[container].onIframeLoaded) {
            window.removeEventListener('message', this.config[container].onIframeLoaded, false);
            this.config[container].onIframeLoaded = '';
        }
    }

    @action.bound
    setIframeUrl(url, container) {
        this.config[container].iframe_url = url;
        if (url) {
            // after we set iframe url we can clear verification code
            this.root_store.client.setVerificationCode('');
        }
    }

    @action.bound
    setContainerHeight(height, container) {
        this.config[container].iframe_height = height;
    }

    @action.bound
    setErrorMessage(message, container) {
        this.config[container].error_message = message;
    }

    @action.bound
    setLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setSessionTimeout(is_session_time_out, container) {
        this.config[container].is_session_timeout = is_session_time_out;
        if (is_session_time_out) {
            this.removeOnIframeLoaded(container);
        }
    }

    @action.bound
    setVerificationButtonClicked(is_button_clicked) {
        this.config.verification.is_button_clicked = is_button_clicked;
    }

    @action.bound
    setVerificationEmailSent(is_email_sent) {
        this.config.verification.is_email_sent = is_email_sent;
    }

    @action.bound
    setVerificationResendClicked(is_resend_clicked) {
        this.config.verification.is_resend_clicked = is_resend_clicked;
    }

    @action.bound
    setVerificationResendTimeout(resend_timeout) {
        this.config.verification.resend_timeout = resend_timeout;
    }

    clearTimeoutCashierUrl(container) {
        if (this.config[container].timeout_session) {
            clearTimeout(this.config[container].timeout_session);
        }
    }

    // cashier session expires after one minute
    // so we should resend the request for container (deposit|withdraw) url on next mount
    @action.bound
    setTimeoutCashierUrl(container) {
        this.clearTimeoutCashierUrl(container);
        this.config[container].timeout_session = setTimeout(() => {
            this.setSessionTimeout(true, container);
        }, 60000);
    }

    clearTimeoutVerification() {
        if (this.config.verification.timeout_button) {
            clearTimeout(this.config.verification.timeout_button);
        }
    }

    // verification token expires after one hour
    // so we should show the verification request button again after that
    @action.bound
    setTimeoutVerification() {
        this.clearTimeoutVerification();
        this.config.verification.timeout_button = setTimeout(() => {
            this.clearVerification();
        }, 3600000);
    }

    @action.bound
    async onMountWithdraw(verification_code) {
        await this.onMount(this.config.withdraw.container, verification_code);
    }

    @action.bound
    async sendVerificationEmail() {
        if (this.config.verification.is_button_clicked) {
            return;
        }

        this.setErrorMessage('', this.config.withdraw.container);
        this.setVerificationButtonClicked(true);
        const response_verify_email = await WS.verifyEmail(this.root_store.client.email, 'payment_withdraw');

        if (response_verify_email.error) {
            this.clearVerification();
            this.setErrorMessage(response_verify_email.error.message, this.config.withdraw.container);
        } else {
            this.setVerificationEmailSent(true);
            this.setTimeoutVerification();
        }
    }

    @action.bound
    resendVerificationEmail() {
        // don't allow clicking while ongoing timeout
        if (this.config.verification.resend_timeout < 60) {
            return;
        }
        this.setVerificationButtonClicked(false);
        this.setCountDownResendVerification();
        this.sendVerificationEmail();
    }

    setCountDownResendVerification() {
        this.setVerificationResendTimeout(this.config.verification.resend_timeout - 1);
        const resend_interval = setInterval(() => {
            if (this.config.verification.resend_timeout === 1) {
                this.setVerificationResendTimeout(60);
                clearInterval(resend_interval);
            } else {
                this.setVerificationResendTimeout(this.config.verification.resend_timeout - 1);
            }
        }, 1000);
    }

    clearVerification() {
        this.clearTimeoutVerification();
        this.setVerificationButtonClicked(false);
        this.setVerificationEmailSent(false);
        this.setVerificationResendClicked(false);
        this.setVerificationResendTimeout(60);
        this.root_store.client.setVerificationCode('');
    }

    @action.bound
    setActiveTab(container) {
        // used to detect if old tabs with withdrawal tab open should be closed after verification token is opened in new tab
        this.root_store.ui.setCashierActiveTab(container);
    }

    onUnmount() {
        this.clearVerification();
        [this.config.deposit.container, this.config.withdraw.container].forEach((container) => {
            this.setIframeUrl('', container);
            this.clearTimeoutCashierUrl(container);
            this.setSessionTimeout(true, container);
        });
    }

    accountSwitcherListener() {
        return new Promise(async (resolve) => resolve(this.onUnmount()));
    }
}
