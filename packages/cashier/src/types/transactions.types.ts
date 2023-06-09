export type TTransactionItem = {
    address_hash: string;
    address_url: string;
    amount?: number;
    id: string;
    is_valid_to_cancel?: number;
    status_code:
        | 'CANCELLED'
        | 'CONFIRMED'
        | 'ERROR'
        | 'LOCKED'
        | 'PENDING'
        | 'PERFORMING_BLOCKCHAIN_TXN'
        | 'PROCESSING'
        | 'REJECTED'
        | 'SENT'
        | 'VERIFIED';
    status_message: string;
    submit_date: number;
    transaction_type: 'deposit' | 'withdrawal';
    transaction_hash?: string;
    transaction_url?: string;
    confirmations?: number;
};
