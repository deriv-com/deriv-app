import { PaymentAgentDetailsResponse, PaymentAgentTransferResponse } from '@deriv/api-types';
import { action, computed, observable, makeObservable } from 'mobx';
import { routes } from '@deriv/shared';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';
import {
    TExtendedPaymentAgentListResponse,
    TPaymentAgent,
    TPaymentAgentTransferReceipt,
    TPaymentAgentTransferConfirm,
    TPaymentAgentTransferRequest,
    TRootStore,
    TServerError,
    TTransferLimit,
    TWebSocket,
} from 'Types';

export default class PaymentAgentTransferStore {
    constructor(public WS: TWebSocket, public root_store: TRootStore) {
        makeObservable(this, {
            container: observable,
            error: observable,
            is_payment_agent: observable,
            is_try_transfer_successful: observable,
            is_transfer_successful: observable,
            confirm: observable,
            receipt: observable,
            transfer_limit: observable,
            is_payment_agent_transfer_visible: computed,
            setIsPaymentAgent: action.bound,
            setIsTryTransferSuccessful: action.bound,
            setIsTransferSuccessful: action.bound,
            setConfirmationPaymentAgentTransfer: action.bound,
            setReceiptPaymentAgentTransfer: action.bound,
            setMinMaxPaymentAgentTransfer: action.bound,
            onMountPaymentAgentTransfer: action.bound,
            requestTryPaymentAgentTransfer: action.bound,
            requestPaymentAgentTransfer: action.bound,
            resetPaymentAgentTransfer: action.bound,
        });
    }

    container = Constants.containers.payment_agent_transfer;
    error = new ErrorStore();
    is_payment_agent = false;
    is_try_transfer_successful = false;
    is_transfer_successful = false;
    confirm = {
        amount: 0,
        client_id: '',
        client_name: '',
        description: '',
    };
    receipt = {};
    transfer_limit = {};
    onRemount: VoidFunction | null = null;

    get is_payment_agent_transfer_visible(): boolean {
        return this.is_payment_agent;
    }

    async checkIsPaymentAgent(): Promise<void> {
        const get_settings = (await this.WS.authorized.storage.getSettings()).get_settings;
        this.setIsPaymentAgent(!!get_settings?.is_authenticated_payment_agent);
    }

    setOnRemount(func: VoidFunction): void {
        this.onRemount = func;
    }

    setIsPaymentAgent(is_payment_agent: boolean): void {
        if (!is_payment_agent && window.location.pathname.endsWith(routes.cashier_pa_transfer)) {
            this.root_store.common.routeTo(routes.cashier_deposit);
        }
        this.is_payment_agent = is_payment_agent;
    }

    setIsTryTransferSuccessful(is_try_transfer_successful: boolean): void {
        this.error.setErrorMessage({ code: '', message: '' });
        this.is_try_transfer_successful = is_try_transfer_successful;
    }

    setIsTransferSuccessful(is_transfer_successful: boolean): void {
        this.is_transfer_successful = is_transfer_successful;
    }

    setConfirmationPaymentAgentTransfer({
        amount,
        client_id,
        client_name,
        description,
    }: TPaymentAgentTransferConfirm): void {
        this.confirm = {
            amount,
            client_id,
            client_name,
            description,
        };
    }

    setReceiptPaymentAgentTransfer({ amount_transferred, client_id, client_name }: TPaymentAgentTransferReceipt): void {
        this.receipt = {
            amount_transferred,
            client_id,
            client_name,
        };
    }

    async getCurrentPaymentAgent(
        response_payment_agent: TExtendedPaymentAgentListResponse
    ): Promise<PaymentAgentDetailsResponse['paymentagent_details'] | TPaymentAgent> {
        const { client, modules } = this.root_store;
        const payment_agent_listed = response_payment_agent.paymentagent_list?.list.find(
            agent => agent.paymentagent_loginid === client.loginid
        );
        const current_payment_agent =
            payment_agent_listed || (await modules.cashier.payment_agent.getPaymentAgentDetails());
        return current_payment_agent ?? {};
    }

    setMinMaxPaymentAgentTransfer({ min_withdrawal, max_withdrawal }: TTransferLimit): void {
        this.transfer_limit = {
            min_withdrawal,
            max_withdrawal,
        };
    }

    async onMountPaymentAgentTransfer(): Promise<void> {
        const { general_store, payment_agent } = this.root_store.modules.cashier;

        general_store.setLoading(true);
        this.setOnRemount(this.onMountPaymentAgentTransfer);
        await general_store.onMountCommon();
        if (!this.transfer_limit.min_withdrawal) {
            const response = await payment_agent.getPaymentAgentList();
            const current_payment_agent = await this.getCurrentPaymentAgent(response);
            if (current_payment_agent?.min_withdrawal) {
                this.setMinMaxPaymentAgentTransfer(current_payment_agent);
            }
        }
        general_store.setLoading(false);
    }

    requestTryPaymentAgentTransfer = async ({
        amount,
        currency,
        description,
        transfer_to,
    }: TPaymentAgentTransferRequest): Promise<PaymentAgentTransferResponse> => {
        this.error.setErrorMessage({ code: '', message: '' });
        const payment_agent_transfer = await this.WS.authorized.paymentAgentTransfer({
            amount,
            currency,
            description,
            transfer_to,
            dry_run: 1,
        });
        if (Number(payment_agent_transfer?.paymentagent_transfer) === 2) {
            // show confirmation screen
            this.setConfirmationPaymentAgentTransfer({
                client_id: transfer_to,
                client_name: payment_agent_transfer.client_to_full_name,
                amount,
                description,
            });
            this.setIsTryTransferSuccessful(true);
        } else {
            this.error.setErrorMessage(payment_agent_transfer.error as TServerError, this.resetPaymentAgentTransfer);
        }

        return payment_agent_transfer;
    };

    requestPaymentAgentTransfer = async ({
        amount,
        currency,
        description,
        transfer_to,
    }: TPaymentAgentTransferRequest): Promise<PaymentAgentTransferResponse> => {
        this.error.setErrorMessage({ code: '', message: '' });
        const payment_agent_transfer = await this.WS.authorized.paymentAgentTransfer({
            amount,
            currency,
            description,
            transfer_to,
        });
        if (Number(payment_agent_transfer?.paymentagent_transfer) === 1) {
            this.setReceiptPaymentAgentTransfer({
                amount_transferred: amount,
                client_id: transfer_to,
                client_name: payment_agent_transfer.client_to_full_name,
            });
            this.setIsTransferSuccessful(true);
            this.setIsTryTransferSuccessful(false);
            this.setConfirmationPaymentAgentTransfer({});
        } else {
            this.error.setErrorMessage(payment_agent_transfer.error as TServerError, this.resetPaymentAgentTransfer);
        }

        return payment_agent_transfer;
    };

    resetPaymentAgentTransfer = (): void => {
        this.setIsTransferSuccessful(false);
        this.error.setErrorMessage({ code: '', message: '' });
    };
}
