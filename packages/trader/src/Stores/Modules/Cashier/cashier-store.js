import {
    action,
    observable }    from 'mobx';
import BinarySocket from '_common/base/socket_base';
import BaseStore    from '../../base-store';

export default class CashierStore extends BaseStore {
    @observable deposit_url   = '';
    @observable error_message = '';
    @observable is_loading    = false;

    @action.bound
    async onMount() {
        // TODO: investigate: set timeout to clear deposit in case session expires after switch/idle?
        if (this.error_message) {
            this.removeErrorMessage();
        }

        this.setLoading(true);

        if (this.deposit_url) {
            this.checkIframeLoaded();
            return;
        }

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
            this.removeLoading();
            this.setErrorMessage(response_cashier.error.message);
        } else {
            await this.checkIframeLoaded();
            this.setDepositUrl(response_cashier.cashier);
        }
    }

    @action.bound
    async checkIframeLoaded() {
        window.removeEventListener('message', this.removeLoading);
        window.addEventListener('message', this.removeLoading, false);
    }

    @action.bound
    setDepositUrl(url) {
        this.deposit_url = url;
    }

    @action.bound
    removeDepositUrl() {
        this.setDepositUrl('');
    }

    @action.bound
    setErrorMessage(message) {
        this.error_message = message;
    }

    @action.bound
    removeErrorMessage() {
        this.setErrorMessage('');
    }

    @action.bound
    setLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    removeLoading() {
        this.setLoading(false);
    }

    @action.bound
    onUnmount() {
        this.removeDepositUrl();
        this.removeErrorMessage();
        this.removeLoading();
    }
}
