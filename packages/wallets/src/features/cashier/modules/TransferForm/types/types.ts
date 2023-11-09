import { useTransfer } from '../provider';

export type TAccount = ReturnType<typeof useTransfer>['activeWallet'];
export type TAccountList = ReturnType<typeof useTransfer>['accounts'];

export type TInitialTransferFormValues = {
    amountReceive: number;
    amountSend: number;
    fromAccount?: TAccount;
    toAccount?: TAccount;
};
