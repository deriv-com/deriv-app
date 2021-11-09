import { action, computed, observable } from 'mobx';

export default class DepositStore {
    constructor({ WS, root_store }) {
        this.root_store = root_store;
        this.WS = WS;
    }

    @observable container = 'deposit';
    @observable error = this.root_store.modules.cashier.error_store;
    @observable iframe = this.root_store.modules.cashier.iframe_store;

    @action.bound
    async onMountDeposit() {
        const { active_container, is_crypto, onMountCommon, setLoading, setOnRemount } =
            this.root_store.modules.cashier.general_store;
        const { is_virtual } = this.root_store.client;
        const current_container = active_container;

        setOnRemount(this.onMountDeposit);
        await onMountCommon();

        this.error.setErrorMessage('');
        this.iframe.setContainerHeight(0);
        setLoading(true);

        if (!this.iframe.is_session_timeout) {
            this.iframe.checkIframeLoaded();
            return;
        }

        // if session has timed out reset everything
        this.iframe.setIframeUrl('');
        if (is_virtual) {
            setLoading(false);
            // if virtual, clear everything and don't proceed further
            // if no verification code, we should request again
            return;
        }

        const response_cashier = await this.WS.authorized.cashier(active_container, {
            verification_code: 'undefined',
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
        } else if (is_crypto) {
            setLoading(false);
        } else {
            await this.iframe.checkIframeLoaded();
            setLoading(false);
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
