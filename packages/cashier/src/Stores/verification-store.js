import { action, observable } from 'mobx';
import ErrorStore from './error-store';

export default class VerificationStore {
    @observable is_button_clicked = false;
    @observable timeout_button = '';
    @observable error = new ErrorStore();
    @observable is_email_sent = false;
    @observable is_resend_clicked = false;
    @observable resend_timeout = 60;

    @action.bound
    setIsButtonClicked(value) {
        this.is_button_clicked = value;
    }

    @action.bound
    setTimeoutButton(value) {
        this.timeout_button = value;
    }

    @action.bound
    setIsEmailSent(value) {
        this.is_email_sent = value;
    }

    @action.bound
    setIsResendClicked(value) {
        this.is_resend_clicked = value;
    }

    @action.bound
    setResendTimeout(value) {
        this.resend_timeout = value;
    }
}
