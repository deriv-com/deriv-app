import {
    action,
    observable }    from 'mobx';
import { WS }       from 'Services';
import BaseStore    from '../../base-store';

export default class CashierStore extends BaseStore {
    @observable is_loading       = false;
    @observable container_height = 0;
    @observable error_message    = '';

    @observable container_urls = {
        deposit : '',
        withdraw: '',
    };

    @observable is_session_timeout = {
        deposit : false,
        withdraw: false,
    };

    containers = {
        deposit : 'deposit',
        withdraw: 'withdraw',
    };

    @observable has_verification_token          = false;
    @observable is_verification_button_disabled = false;

    @action.bound
    async onMountDeposit() {
        this.setErrorMessage('');
        this.setContainerHeight(0);
        this.setLoading(true);

        if (this.container_urls.deposit && !this.is_session_timeout.deposit) {
            this.checkIframeLoaded();
            return;
        }

        this.setSessionTimeout(false, this.containers.deposit);
        this.setContainerUrl('', this.containers.deposit);

        const response_cashier = await WS.cashier(this.containers.deposit);

        // TODO: uncomment this if cross origin access is allowed
        // const xhttp = new XMLHttpRequest();
        // const that = this;
        // xhttp.onreadystatechange = function() {
        //     if (this.readyState !== 4 || this.status !== 200) {
        //         return;
        //     }
        //     that.setContainerUrl(this.responseText, this.containers.deposit);
        // };
        // xhttp.open('GET', response_cashier.cashier, true);
        // xhttp.send();

        // TODO: error handling
        if (response_cashier.error) {
            this.setLoading(false);
            this.setErrorMessage(response_cashier.error.message);
        } else {
            await this.checkIframeLoaded();
            this.setContainerUrl(response_cashier.cashier, this.containers.deposit);

            // cashier session runs out after one minute
            // so we should resend the request for deposit url on next mount
            setTimeout(() => {
                this.setSessionTimeout(true, this.containers.deposit);
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
        this.setContainerHeight('100%');
    }

    @action.bound
    setContainerUrl(url, container) {
        this.container_urls[container] = url;
    }

    @action.bound
    setContainerHeight(height) {
        this.container_height = height;
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
    setSessionTimeout(is_session_time_out, container) {
        this.is_session_timeout[container] = is_session_time_out;
    }

    @action.bound
    async onMountWithdraw() {
        this.setErrorMessage('');
        this.setContainerHeight(0);
        this.setLoading(true);

        if (this.container_urls.withdraw && !this.is_session_timeout.withdraw) {
            this.checkIframeLoaded();
            return;
        }

        this.setSessionTimeout(false, this.containers.withdraw);
        this.setContainerUrl('', this.containers.withdraw);

        const response_cashier = await WS.cashier(this.containers.withdraw);

        // TODO: uncomment this if cross origin access is allowed
        // const xhttp = new XMLHttpRequest();
        // const that = this;
        // xhttp.onreadystatechange = function() {
        //     if (this.readyState !== 4 || this.status !== 200) {
        //         return;
        //     }
        //     that.setContainerUrl(this.responseText, this.containers.withdraw);
        // };
        // xhttp.open('GET', response_cashier.cashier, true);
        // xhttp.send();

        // TODO: error handling
        if (response_cashier.error) {
            this.setLoading(false);
            this.setErrorMessage(response_cashier.error.message);
        } else {
            await this.checkIframeLoaded();
            this.setContainerUrl(response_cashier.cashier, this.containers.withdraw);

            // cashier session runs out after one minute
            // so we should resend the request for withdraw url on next mount
            setTimeout(() => {
                this.setSessionTimeout(true, this.containers.withdraw);
            }, 60000);
        }
    }

    @action.bound
    sendVerificationEmail(email) {
        if (this.is_verification_button_disabled) {
            return;
        }

        this.is_verification_button_disabled = true;
        // WS.verifyEmail(email, 'payment_withdraw');
    }
}
