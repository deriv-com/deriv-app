import { THooks } from '../../../../../types';
import type { TTransferMessagesKeys } from '../components/TransferMessages/TransferMessagesConfig';
import type { TTransferContext } from '../provider';

export type TAccount = TTransferContext['activeWallet'];
export type TAccountsList = TTransferContext['accounts'];

export type TInitialTransferFormValues = {
    activeAmountFieldName?: 'fromAmount' | 'toAmount';
    fromAccount?: TAccount;
    fromAmount: number;
    toAccount?: TAccount;
    toAmount: number;
};

export type TMessage = {
    key: TTransferMessagesKeys;
    type: 'error' | 'info' | 'success';
    values: Record<string, boolean | number | string | undefined>;
};

export type TMessageFnProps = {
    USDExchangeRates?: THooks.ExchangeRate;
    activeWallet: THooks.ActiveWalletAccount;
    activeWalletExchangeRates?: THooks.ExchangeRate;
    displayMoney?: (amount: number, currency: string, fractionalDigits: number) => string;
    limits?: THooks.AccountLimits;
    sourceAccount: NonNullable<TAccount>;
    sourceAmount: number;
    targetAccount: NonNullable<TAccount>;
};
