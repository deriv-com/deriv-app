export type TPaymentAgentTransferConfirm = {
    amount?: string;
    client_id?: string;
    client_name?: string;
    description?: string;
};

export type TPaymentAgentTransferReceipt = {
    amount_transferred?: string;
    client_id?: string;
    client_name?: string;
};

export type TTransferLimit = {
    min_withdrawal?: null | string | number;
    max_withdrawal?: null | string | number;
};
