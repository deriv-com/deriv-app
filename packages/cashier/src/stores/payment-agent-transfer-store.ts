import { action, computed, observable } from 'mobx';
import { PaymentAgentDetailsResponse, PaymentAgentListResponse, PaymentAgentTransferRequest } from '@deriv/api-types';
import { routes } from '@deriv/shared';
import Constants from 'Constants/constants';
import { TRootStore, TWebSocket } from 'Types';
import ErrorStore from './error-store';

type TConfirm = {
    amount?: number;
    client_id?: string;
    client_name?: string;
    description?: string;
};

type TReceipt = {
    amount_transferred?: number;
    client_id?: string;
    client_name?: string;
};

type TMinMax = {
    min_withdrawal?: number;
    max_withdrawal?: number;
};

export default class PaymentAgentTransferStore {
    constructor(public WS: TWebSocket, public root_store: TRootStore) {
        this.root_store = root_store;
        this.WS = WS;
    }

    @observable container = Constants.containers.payment_agent_transfer;
    @observable error = new ErrorStore();
    @observable is_payment_agent = false;
    @observable is_try_transfer_successful = false;
    @observable is_transfer_successful = false;
    @observable confirm: TConfirm = {};
    @observable receipt: TReceipt = {};
    @observable transfer_limit: TMinMax = {};
    @observable onRemount: () => Promise<void>;

    @computed
    get is_payment_agent_transfer_visible(): boolean {
        return this.is_payment_agent;
    }

    async checkIsPaymentAgent(): Promise<void> {
        const response = await this.WS.authorized.storage.getSettings();

        this.setIsPaymentAgent(response.get_settings?.is_authenticated_payment_agent === 1);
    }

    @action.bound
    setIsPaymentAgent(is_payment_agent: boolean): void {
        if (!is_payment_agent && window.location.pathname.endsWith(routes.cashier_pa_transfer)) {
            this.root_store.common.routeTo(routes.cashier_deposit);
        }

        this.is_payment_agent = is_payment_agent;
    }

    @action.bound
    setIsTryTransferSuccessful(is_try_transfer_successful: boolean): void {
        this.error.setErrorMessage('');
        this.is_try_transfer_successful = is_try_transfer_successful;
    }

    @action.bound
    setIsTransferSuccessful(is_transfer_successful: boolean): void {
        this.is_transfer_successful = is_transfer_successful;
    }

    @action.bound
    setConfirmationPaymentAgentTransfer({ amount, client_id, client_name, description }: TConfirm): void {
        this.confirm = {
            amount,
            client_id,
            client_name,
            description,
        };
    }

    @action.bound
    setReceiptPaymentAgentTransfer({ amount_transferred, client_id, client_name }: TReceipt): void {
        this.receipt = {
            amount_transferred,
            client_id,
            client_name,
        };
    }

    async getCurrentPaymentAgent(response_payment_agent: PaymentAgentListResponse): Promise<TMinMax> {
        const { client, modules } = this.root_store;
        const payment_agent_listed = response_payment_agent.paymentagent_list?.list.find(
            agent => agent.paymentagent_loginid === client.loginid
        );
        const response: PaymentAgentDetailsResponse = await modules.cashier.payment_agent.getPaymentAgentDetails();
        const min = payment_agent_listed?.min_withdrawal || response.paymentagent_details?.min_withdrawal;
        const max = payment_agent_listed?.max_withdrawal || response.paymentagent_details?.max_withdrawal;

        return {
            min_withdrawal: min ? Number(min) : undefined,
            max_withdrawal: max ? Number(max) : undefined,
        };
    }

    @action.bound
    setMinMaxPaymentAgentTransfer({ min_withdrawal, max_withdrawal }: TMinMax) {
        this.transfer_limit = {
            min: min_withdrawal,
            max: max_withdrawal,
        };
    }

    @action.bound
    async onMountPaymentAgentTransfer() {
        const { general_store, payment_agent } = this.root_store.modules.cashier;

        general_store.setLoading(true);
        this.onRemount = this.onMountPaymentAgentTransfer;
        await general_store.onMountCommon();
        if (!this.transfer_limit.min_withdrawal) {
            const response: PaymentAgentListResponse = await payment_agent.getPaymentAgentList();
            const current_payment_agent = await this.getCurrentPaymentAgent(response);
            this.setMinMaxPaymentAgentTransfer(current_payment_agent);
        }
        general_store.setLoading(false);
    }

    @action.bound
    requestTryPaymentAgentTransfer = async ({
        amount,
        currency,
        description,
        transfer_to,
    }: PaymentAgentTransferRequest) => {
        this.error.setErrorMessage('');

        const payment_agent_transfer = await this.WS.authorized.paymentAgentTransfer({
            amount,
            currency,
            description,
            transfer_to,
            dry_run: 1,
        });

        if (payment_agent_transfer.paymentagent_transfer === 2) {
            // show confirmation screen
            this.setConfirmationPaymentAgentTransfer({
                client_id: transfer_to,
                client_name: payment_agent_transfer.client_to_full_name,
                amount,
                description,
            });
            this.setIsTryTransferSuccessful(true);
        } else {
            this.error.setErrorMessage(payment_agent_transfer.error, this.resetPaymentAgentTransfer);
        }

        return payment_agent_transfer;
    };

    @action.bound
    requestPaymentAgentTransfer = async ({
        amount,
        currency,
        description,
        transfer_to,
    }: PaymentAgentTransferRequest) => {
        this.error.setErrorMessage('');

        const payment_agent_transfer = await this.WS.authorized.paymentAgentTransfer({
            amount,
            currency,
            description,
            transfer_to,
        });

        if (payment_agent_transfer.paymentagent_transfer === 1) {
            this.setReceiptPaymentAgentTransfer({
                amount_transferred: amount,
                client_id: transfer_to,
                client_name: payment_agent_transfer.client_to_full_name,
            });
            this.setIsTransferSuccessful(true);
            this.setIsTryTransferSuccessful(false);
            this.setConfirmationPaymentAgentTransfer({
                amount: undefined,
                client_id: undefined,
                client_name: undefined,
                description: undefined,
            });
        } else {
            this.error.setErrorMessage(payment_agent_transfer.error, this.resetPaymentAgentTransfer);
        }

        return payment_agent_transfer;
    };

    @action.bound
    resetPaymentAgentTransfer = (): void => {
        this.setIsTransferSuccessful(false);
        this.error.setErrorMessage('');
    };
}
