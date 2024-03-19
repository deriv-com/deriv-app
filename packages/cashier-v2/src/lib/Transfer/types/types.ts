import { THooks } from '../../../hooks/types';

export type TTransferableAccounts = THooks.CurrencyConfig & THooks.TransferAccounts;

export type TTransferReceipt = {
    amount: string;
    fromAccount: TTransferableAccounts[number];
    toAccount: TTransferableAccounts[number];
};
