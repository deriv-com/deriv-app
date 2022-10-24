import { action, observable } from 'mobx';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';
import { TRootStore, TWebSocket } from 'Types';

export default class VerificationStore {
    resend_interval?: ReturnType<typeof setInterval>;
    constructor(public WS: TWebSocket, public root_store: TRootStore) {
        this.root_store = root_store;
        this.WS = WS;
    }

    @observable is_button_clicked = false;
    @observable timeout_button = 0;
    @observable error = new ErrorStore();
    @observable is_email_sent = false;
    @observable is_resend_clicked = false;
    @observable resend_timeout = 60;

    @action.bound
    setIsButtonClicked(value: boolean): void {
        this.is_button_clicked = value;
    }

    @action.bound
    setTimeoutButton(value: number): void {
        this.timeout_button = value;
    }

    @action.bound
    setIsEmailSent(value: boolean): void {
        this.is_email_sent = value;
    }

    @action.bound
    setIsResendClicked(value: boolean): void {
        this.is_resend_clicked = value;
    }

    @action.bound
    setResendTimeout(value: number): void {
        this.resend_timeout = value;
    }

    clearTimeoutVerification(): void {
        if (this.timeout_button) {
            clearTimeout(this.timeout_button);
        }
    }

    @action.bound
    setTimeoutVerification(): void {
        this.clearTimeoutVerification();
        this.setTimeoutButton(
            Number(
                setTimeout(() => {
                    this.clearVerification();
                }, 3600000)
            )
        );
    }

    @action.bound
    async sendVerificationEmail() {
        const { client, modules } = this.root_store;
        const { resetPaymentAgent } = modules.cashier.payment_agent;
        const { active_container } = modules.cashier.general_store;
        const container = Constants.map_action[active_container as keyof typeof Constants.map_action];

        if (this.is_button_clicked || !client.email) {
            return;
        }

        this.error.setErrorMessage({ message: '', code: '' });
        this.setIsButtonClicked(true);
        const withdrawal_type = container === 'payment_agent_withdraw' ? 'paymentagent_withdraw' : 'payment_withdraw';
        const response_verify_email = await this.WS.verifyEmail?.(client.email, withdrawal_type);

        if (response_verify_email.error) {
            if (
                ['PaymentAgentJustification', 'PaymentAgentWithdrawSameMethod', 'PaymentAgentUseOtherMethod'].includes(
                    response_verify_email.error.code
                )
            ) {
                this.error.setErrorMessage(response_verify_email.error, null, null);
                return;
            }
            this.clearVerification();
            if (response_verify_email.error.code === 'PaymentAgentWithdrawError') {
                this.error.setErrorMessage(response_verify_email.error, resetPaymentAgent, null);
            } else {
                this.error.setErrorMessage(
                    response_verify_email.error,
                    () => {
                        this.error.setErrorMessage({ message: '', code: '' }, null, null);
                    },
                    null
                );
            }
        } else {
            this.setIsEmailSent(true);
            this.setTimeoutVerification();
        }
    }

    @action.bound
    resendVerificationEmail() {
        // don't allow clicking while ongoing timeout
        if (this.resend_timeout < 60) {
            return;
        }
        this.setIsButtonClicked(false);
        this.setCountDownResendVerification();
        this.sendVerificationEmail();
    }

    setCountDownResendVerification() {
        this.setResendTimeout(this.resend_timeout - 1);
        this.resend_interval = setInterval(() => {
            if (this.resend_timeout === 1) {
                this.setResendTimeout(60);
                clearInterval(this.resend_interval);
            } else {
                this.setResendTimeout(this.resend_timeout - 1);
            }
        }, 1000);
    }

    clearVerification() {
        const { client, modules } = this.root_store;
        const { active_container } = modules.cashier.general_store;
        const container = Constants.map_action[active_container as keyof typeof Constants.map_action];

        this.clearTimeoutVerification();
        this.setIsButtonClicked(false);
        this.setIsEmailSent(false);
        this.setIsResendClicked(false);
        this.setResendTimeout(60);
        this.error.setErrorMessage({ message: '', code: '' }, null, null);
        client.setVerificationCode('', container);
    }
}
