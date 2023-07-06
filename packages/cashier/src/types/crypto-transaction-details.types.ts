import { TTransactionType, TStatusCode } from './transactions.types';

export type TCryptoTransactionDetails = {
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
    transaction_url: string;
};
