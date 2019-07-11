import {
    action,
    observable }    from 'mobx';
import BinarySocket from '_common/base/socket_base';
import BaseStore    from '../../base-store';

export default class CashierStore extends BaseStore {
    @observable deposit_url         = '';
    @observable error_message       = '';
    @observable is_loading          = false;
    @observable is_session_time_out = false;
    @observable deposit_height      = 0;

    @action.bound
    async onMount() {
        // TODO: investigate: set timeout to clear deposit in case session expires after switch/idle?
        if (this.error_message) {
            this.removeErrorMessage();
        }

        this.setDepositHeight(0);
        this.setLoading(true);

        if (this.deposit_url && !this.is_session_time_out) {
            this.checkIframeLoaded();
            return;
        }

        this.setSessionTimeout(false);
        this.setDepositUrl('');
        this.setErrorMessage('');

        const response_cashier = await BinarySocket.send({ cashier: 'deposit' });

        // TODO: uncomment this if cross origin access is allowed
        // const xhttp = new XMLHttpRequest();
        // const that = this;
        // xhttp.onreadystatechange = function() {
        //     if (this.readyState !== 4 || this.status !== 200) {
        //         return;
        //     }
        //     that.setDepositUrl(this.responseText);
        // };
        // xhttp.open('GET', response_cashier.cashier, true);
        // xhttp.send();

        // TODO: error handling
        if (response_cashier.error) {
            this.setLoading(false);
            this.setErrorMessage(response_cashier.error.message);
        } else {
            await this.checkIframeLoaded();
            this.setDepositUrl(response_cashier.cashier);

            // cashier session runs out after one minute
            // so we should resend the request for deposit url on next mount
            setTimeout(() => {
                this.setSessionTimeout(true);
            }, 60000);
        }
    }

    @action.bound
    async checkIframeLoaded() {
        window.removeEventListener('message', this.onIframeLoaded);
        window.addEventListener('message', this.onIframeLoaded, false);
    }

    @action.bound
    onIframeLoaded() {
        this.setLoading(false);
        // set the height of the container after content loads so that the
        // loading bar stays vertically centered until the end
        this.setDepositHeight('100%');
    }

    @action.bound
    setDepositUrl(url) {
        this.deposit_url = url;
    }

    @action.bound
    setDepositHeight(height) {
        this.deposit_height = height;
    }

    @action.bound
    setErrorMessage(message) {
        this.error_message = message;
    }

    @action.bound
    setLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setSessionTimeout(is_session_time_out) {
        this.is_session_time_out = is_session_time_out;
    }
}
