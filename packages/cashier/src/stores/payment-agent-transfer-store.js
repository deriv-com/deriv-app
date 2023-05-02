import { action, observable, makeObservable } from 'mobx';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';

export default class PaymentAgentTransferStore {
    constructor({ WS, root_store }) {
        makeObservable(this, {
            container: observable,
            error: observable,
            is_try_transfer_successful: observable,
            is_transfer_successful: observable,
            confirm: observable,
            receipt: observable,
            transfer_limit: observable,
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

        this.root_store = root_store;
        this.WS = WS;
    }

    container = Constants.containers.payment_agent_transfer;
    error = new ErrorStore();
    is_try_transfer_successful = false;
    is_transfer_successful = false;
    confirm = {};
    receipt = {};
    transfer_limit = {};

    setIsTryTransferSuccessful(is_try_transfer_successful) {
        this.error.setErrorMessage('');
        this.is_try_transfer_successful = is_try_transfer_successful;
    }

    setIsTransferSuccessful(is_transfer_successful) {
        this.is_transfer_successful = is_transfer_successful;
    }

    setConfirmationPaymentAgentTransfer({ amount, client_id, client_name, description }) {
        this.confirm = {
            amount,
            client_id,
            client_name,
            description,
        };
    }

    setReceiptPaymentAgentTransfer({ amount_transferred, client_id, client_name }) {
        this.receipt = {
            amount_transferred,
            client_id,
            client_name,
        };
    }

    async getCurrentPaymentAgent(response_payment_agent) {
        const { client, modules } = this.root_store;
        const payment_agent_listed = response_payment_agent.paymentagent_list.list.find(
            agent => agent.paymentagent_loginid === client.loginid
        );
        const current_payment_agent =
            payment_agent_listed || (await modules.cashier.payment_agent.getPaymentAgentDetails());
        return current_payment_agent ?? {};
    }

    setMinMaxPaymentAgentTransfer({ min_withdrawal, max_withdrawal }) {
        this.transfer_limit = {
            min: min_withdrawal,
            max: max_withdrawal,
        };
    }

    async onMountPaymentAgentTransfer() {
        const { general_store, payment_agent } = this.root_store.modules.cashier;

        general_store.setLoading(true);
        this.onRemount = this.onMountPaymentAgentTransfer;
        await general_store.onMountCommon();
        if (!this.transfer_limit.min_withdrawal) {
            const response = await payment_agent.getPaymentAgentList();
            const current_payment_agent = await this.getCurrentPaymentAgent(response);
            this.setMinMaxPaymentAgentTransfer(current_payment_agent);
        }
        general_store.setLoading(false);
    }

    requestTryPaymentAgentTransfer = async ({ amount, currency, description, transfer_to }) => {
        this.error.setErrorMessage('');
        const payment_agent_transfer = await this.WS.authorized.paymentAgentTransfer({
            amount,
            currency,
            description,
            transfer_to,
            dry_run: 1,
        });
        if (+payment_agent_transfer.paymentagent_transfer === 2) {
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

    requestPaymentAgentTransfer = async ({ amount, currency, description, transfer_to }) => {
        this.error.setErrorMessage('');
        const payment_agent_transfer = await this.WS.authorized.paymentAgentTransfer({
            amount,
            currency,
            description,
            transfer_to,
        });
        if (+payment_agent_transfer.paymentagent_transfer === 1) {
            this.setReceiptPaymentAgentTransfer({
                amount_transferred: amount,
                client_id: transfer_to,
                client_name: payment_agent_transfer.client_to_full_name,
            });
            this.setIsTransferSuccessful(true);
            this.setIsTryTransferSuccessful(false);
            this.setConfirmationPaymentAgentTransfer({});
        } else {
            this.error.setErrorMessage(payment_agent_transfer.error, this.resetPaymentAgentTransfer);
        }

        return payment_agent_transfer;
    };

    resetPaymentAgentTransfer = () => {
        this.setIsTransferSuccessful(false);
        this.error.setErrorMessage('');
    };
}
