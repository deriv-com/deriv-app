import {
    action,
    observable }    from 'mobx';
import { localize } from 'App/i18n';
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

    @observable is_verification_button_clicked = false;
    @observable is_verification_email_sent     = false;

    containers = {
        deposit : 'deposit',
        withdraw: 'withdraw',
    };

    timeout_verification_button;

    @action.bound
    async onMount(container, verification_code) {
        if (!['deposit', 'withdraw'].includes(container)) {
            throw new Error('Cahshier Store onMount requires deposit or cashier as a container name');
        }
        this.setErrorMessage('');
        this.setContainerHeight(0);
        this.setLoading(true);

        if (this.container_urls[container] && !this.is_session_timeout[container]) {
            this.checkIframeLoaded();
            return;
        }

        this.setSessionTimeout(false, this.containers[container]);
        this.setContainerUrl('', this.containers[container]);

        const response_cashier = await WS.cashier(this.containers[container], verification_code);

        // TODO: uncomment this if cross origin access is allowed
        // const xhttp = new XMLHttpRequest();
        // const that = this;
        // xhttp.onreadystatechange = function() {
        //     if (this.readyState !== 4 || this.status !== 200) {
        //         return;
        //     }
        //     that.setContainerUrl(this.responseText, this.containers[container]);
        // };
        // xhttp.open('GET', response_cashier.cashier, true);
        // xhttp.send();

        // TODO: error handling
        if (response_cashier.error) {
            this.setLoading(false);
            this.setErrorMessage(this.getErrorMessage(response_cashier.error));
            if (verification_code) {
                // clear verification code on error
                this.clearVerification();
            }
        } else {
            await this.checkIframeLoaded();
            this.setContainerUrl(response_cashier.cashier, this.containers[container]);

            // cashier session runs out after one minute
            // so we should resend the request for container (deposit|withdraw) url on next mount
            setTimeout(() => {
                this.setSessionTimeout(true, this.containers[container]);
            }, 60000);
        }
    }

    @action.bound
    async onMountDeposit() {
        await this.onMount('deposit');
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

    getDetails = (error) => {
        let error_fields,
            details_fields;
        if (error.details && error.details.fields) {
            error_fields = {
                address_city    : localize('Town/City'),
                address_line_1  : localize('First line of home address'),
                address_postcode: localize('Postal Code/ZIP'),
                address_state   : localize('State/Province'),
                email           : localize('Email address'),
                phone           : localize('Telephone'),
                residence       : localize('Country of Residence'),
            };
            details_fields = error.details.fields.map(field => (error_fields[field] || field));
        }
        return details_fields ? details_fields.join(', ') : localize('details');
    };

    // TODO: add action links to error messages when pages are available
    getErrorMessage(error) {
        let error_message = error.message;
        switch (error.code) {
            case 'ASK_TNC_APPROVAL':
                error_message = 'Please accept the updated Terms and Conditions.';
                break;
            case 'ASK_FIX_DETAILS':
                error_message = localize('There was a problem validating your personal details. Please update your {{details}} here.', { details: this.getDetails(error) });
                break;
            // case 'ASK_UK_FUNDS_PROTECTION':
            //     initUKGC();
            //     break;
            // case 'ASK_AUTHENTICATE':
            //     showMessage('not_authenticated_message');
            //     break;
            // case 'ASK_FINANCIAL_RISK_APPROVAL':
            //     showError('financial_risk_error');
            //     break;
            // case 'ASK_AGE_VERIFICATION':
            //     showError('age_error');
            //     break;
            // case 'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET':
            //     showError('limits_error');
            //     break;
            default:
                break;
        }
        return error_message;
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
    setVerificationButtonClicked(is_verification_button_clicked) {
        this.is_verification_button_clicked = is_verification_button_clicked;
    }

    @action.bound
    setVerificationEmailSent(is_verification_email_sent) {
        this.is_verification_email_sent = is_verification_email_sent;
    }

    clearTimeoutVerification() {
        if (this.timeout_verification_button) {
            clearTimeout(this.timeout_verification_button);
        }
    }

    // verification token expires after one hour
    // so we should show the verification request button again after that
    @action.bound
    setTimeoutVerification() {
        this.clearTimeoutVerification();
        this.timeout_verification_button = setTimeout(() => {
            this.clearVerification();
        }, 3600000);
    }

    @action.bound
    async onMountWithdraw(verification_code) {
        await this.onMount('withdraw', verification_code);
    }

    @action.bound
    async sendVerificationEmail(email) {
        if (this.is_verification_button_clicked) {
            return;
        }

        this.setVerificationButtonClicked(true);
        const response_verify_email = await WS.verifyEmail(email, 'payment_withdraw');

        if (response_verify_email.error) {
            this.setVerificationButtonClicked(false);
            this.setErrorMessage(response_verify_email.error.message);
        } else {
            this.setVerificationEmailSent(true);
            this.setTimeoutVerification();
        }
    }

    clearVerification() {
        this.clearTimeoutVerification();
        this.setVerificationButtonClicked(false);
        this.setVerificationEmailSent(false);
        this.root_store.client.setVerificationCode('');
    }

    @action.bound
    setActiveTab(container) {
        // used to detect if old tabs with withdrawal tab open should be closed after verification token is opened in new tab
        this.root_store.ui.setCashierActiveTab(container);
    }
}
