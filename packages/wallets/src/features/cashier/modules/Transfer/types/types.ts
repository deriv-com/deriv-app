import { useWalletTransfer } from '../hooks';

export type TAccount = ReturnType<typeof useWalletTransfer>['activeWallet'];

export type TInitialTransferFormValues = {
    amountReceive: number;
    amountSend: number;
    fromAccount?: TAccount;
    toAccount?: TAccount;
};
