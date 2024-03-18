import { THooks } from '../../../hooks/types';

export type TTransferableAccounts = THooks.CurrencyConfig & THooks.TransferAccounts;

export type TTransferReceipt = {
    amount: string;
    fromAccount: TTransferableAccounts[number];
    toAccount: TTransferableAccounts[number];
};

export type TTransferFormikContext = {
    fromAccount: TTransferableAccounts[number] | undefined;
    fromAmount: string;
    toAccount: TTransferableAccounts[number] | undefined;
    toAmount: string;
};
