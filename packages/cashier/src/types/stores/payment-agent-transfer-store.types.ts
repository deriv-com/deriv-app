export type TPaymentAgentTransferConfirm = {
    amount: number;
    client_id: string;
    client_name?: string;
    description: string;
};

export type TPaymentAgentTransferReceipt = {
    amount_transferred?: number;
    client_id?: string;
    client_name?: string;
};

export type TTransferLimit = {
    min_withdrawal?: null | string | number;
    max_withdrawal?: null | string | number;
};

export type TPaymentAgentTransferRequest = {
    amount: number;
    currency: string;
    description: string;
    dry_run?: number;
    transfer_to: string;
};
