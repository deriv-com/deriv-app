import { action, computed, observable } from 'mobx';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';
import { TRootStore, TWebSocket } from 'Types';

export default class DepositStore {
    constructor(public WS: TWebSocket, public root_store: TRootStore) {
        this.root_store = root_store;
        this.WS = WS;
    }

    @observable container = Constants.containers.deposit;
    @observable error = new ErrorStore();

    @action.bound
    async onMountDeposit(): Promise<void> {
        const { client, modules } = this.root_store;
        const { active_container, is_crypto, onMountCommon, setLoading, setOnRemount } = modules.cashier.general_store;
        const {
            checkIframeLoaded,
            clearTimeoutCashierUrl,
            is_session_timeout,
            setContainerHeight,
            setIframeUrl,
            setSessionTimeout,
            setTimeoutCashierUrl,
        } = modules.cashier.iframe;
        const { account_status, is_virtual, updateAccountStatus } = client;
        const current_container = active_container;

        setOnRemount(this.onMountDeposit);
        await onMountCommon();

        this.error.setErrorMessage({ code: '', message: '' }, null, false);
        setContainerHeight(0);
        setLoading(true);

        if (!is_session_timeout) {
            checkIframeLoaded();
            return;
        }

        // if session has timed out reset everything
        setIframeUrl('');
        if (is_virtual) {
            setLoading(false);
            // if virtual, clear everything and don't proceed further
            // if no verification code, we should request again
            return;
        }

        if (!is_crypto) {
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
                setSessionTimeout(true);
                clearTimeoutCashierUrl();
            } else {
                await checkIframeLoaded();
                setIframeUrl(response_cashier.cashier);
                setSessionTimeout(false);
                setTimeoutCashierUrl();
            }
        }

        if (!account_status?.status?.includes('deposit_attempt')) {
            await updateAccountStatus();
        }

        setLoading(false);
    }

    @computed
    get is_deposit_locked(): boolean {
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
    submitFundsProtection(): void {
        this.WS.send({ ukgc_funds_protection: 1, tnc_approval: 1 }).then(response => {
            if (response.error) {
                this.error.setMessage(response.error.message);
            } else {
                location.reload();
            }
        });
    }
}
