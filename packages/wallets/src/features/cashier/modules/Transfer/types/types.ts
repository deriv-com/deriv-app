import { THooks } from '../../../../../types';
import type { TTransferContext } from '../provider';

export type TAccount = TTransferContext['activeWallet'];
export type TAccountsList = TTransferContext['accounts'];
export type TToAccount = TAccountsList[keyof TAccountsList][number] | undefined;

export type TInitialTransferFormValues = {
    activeAmountFieldName?: 'fromAmount' | 'toAmount';
    fromAccount?: TAccount;
    fromAmount: number;
    isError?: boolean;
    toAccount?: TToAccount;
    toAmount: number;
};

type TAction = {
    buttonLabel?: string;
    navigateTo?: string;
    shouldOpenInNewTab?: boolean;
};

type TMessage = {
    text: string;
    values: Record<string, boolean | number | string | undefined>;
};

export type TTransferMessage = {
    action?: TAction;
    message: TMessage;
    type: 'error' | 'info' | 'success';
};

export type TMessageFnProps = {
    USDExchangeRates?: THooks.ExchangeRate;
    activeWallet: THooks.ActiveWalletAccount;
    activeWalletExchangeRates?: THooks.ExchangeRate;
    displayMoney?: (amount: number, currency: string, fractionalDigits: number) => string;
    fiatAccount?: THooks.WalletAccountsList;
    limits?: THooks.AccountLimits;
    sourceAccount: NonNullable<TAccount>;
    sourceAmount: number;
    targetAccount: TAccount;
    targetAmount: number;
};
