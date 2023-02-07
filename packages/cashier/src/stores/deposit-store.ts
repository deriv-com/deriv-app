import { action, makeObservable, observable } from 'mobx';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';
import { TRootStore, TWebSocket } from '../types';

export default class DepositStore {
    constructor(public WS: TWebSocket, public root_store: TRootStore) {
        makeObservable(this, {
            container: observable,
            error: observable,
            onMountDeposit: action.bound,
        });

        this.root_store = root_store;
        this.WS = WS;
    }

    container = Constants.containers.deposit;
    error = new ErrorStore();

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
}
