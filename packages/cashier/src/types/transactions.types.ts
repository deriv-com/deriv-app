export type TTransactionType = 'deposit' | 'withdrawal';

export type TStatusCode =
    | 'CONFIRMED'
    | 'ERROR'
    | 'PENDING'
    | 'CANCELLED'
    | 'LOCKED'
    | 'PERFORMING_BLOCKCHAIN_TXN'
    | 'PROCESSING'
    | 'REJECTED'
    | 'SENT'
    | 'VERIFIED';

export type TTransactionItem = {
    address_hash: string;
    address_url: string;
    amount: number;
    id: string;
    is_valid_to_cancel: number;
    status_code: TStatusCode;
    status_message: string;
    submit_date: number;
    transaction_type: TTransactionType;
    transaction_hash: string;
};
