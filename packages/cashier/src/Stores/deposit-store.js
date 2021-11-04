import { action, computed, observable } from 'mobx';
import { isCryptocurrency } from '@deriv/shared';

export default class DepositStore {
    constructor({ WS, root_store }) {
        this.root_store = root_store;
        this.WS = WS;
    }

    @observable container = 'deposit';
    @observable error = this.root_store.modules.cashier.error_store;
    @observable iframe = this.root_store.modules.cashier.iframe_store;

    @action.bound
    async onMountDeposit(verification_code) {
        const { general_store, withdraw_store } = this.root_store.modules.cashier;
        const { active_container, setLoading } = general_store;
        const { currency, is_virtual } = this.root_store.client;
        const current_container = active_container;

        this.error.setErrorMessage('');
        this.iframe.setContainerHeight(0);
        setLoading(true);

        if (!this.iframe.is_session_timeout) {
            this.iframe.checkIframeLoaded();
            return;
        }

        // if session has timed out reset everything
        this.iframe.setIframeUrl('');
        if ((active_container === withdraw_store.container && !verification_code) || is_virtual) {
            setLoading(false);
            // if virtual, clear everything and don't proceed further
            // if no verification code, we should request again
            return;
        }

        const response_cashier = await this.WS.authorized.cashier(active_container, {
            verification_code,
        });

        // if tab changed while waiting for response, ignore it
        if (current_container !== active_container) {
            setLoading(false);
            return;
        }
        if (response_cashier.error) {
            this.error.handleCashierError(response_cashier.error);
            setLoading(false);
            this.iframe.setSessionTimeout(true);
            this.iframe.clearTimeoutCashierUrl();
            if (verification_code) {
                // clear verification code on error
                this.verification.clearVerification();
            }
        } else if (isCryptocurrency(currency)) {
            setLoading(false);
            this.iframe.setContainerHeight('380');
            this.iframe.setIframeUrl(response_cashier.cashier);
            // crypto cashier can only be accessed once and the session expires
            // so no need to set timeouts to keep the session alive
        } else {
            await this.iframe.checkIframeLoaded();
            this.iframe.setIframeUrl(response_cashier.cashier);
            this.iframe.setSessionTimeout(false);
            this.iframe.setTimeoutCashierUrl();
        }
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

        const need_authentication = this.error.is_ask_authentication || (is_authentication_needed && is_eu);
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
            this.error.is_ask_financial_risk_approval
        );
    }

    @action.bound
    submitFundsProtection() {
        this.WS.send({ ukgc_funds_protection: 1, tnc_approval: 1 }).then(response => {
            if (response.error) {
                this.error.setMessage(response.error.message);
            } else {
                location.reload();
            }
        });
    }
}
