import { useWalletTransfer } from '../hooks';

type TAccount = ReturnType<typeof useWalletTransfer>['activeWallet'];

export type TInitialTransferFormValues = {
    amountReceive: number;
    amountSend: number;
    fromAccount?: TAccount;
    toAccount?: TAccount;
};
