import type { TTransferContext } from '../provider';

export type TAccount = TTransferContext['activeWallet'];
export type TAccountsList = TTransferContext['accounts'];

export type TInitialTransferFormValues = {
    amountReceive: number;
    amountSend: number;
    fromAccount?: TAccount;
    toAccount?: TAccount;
};
