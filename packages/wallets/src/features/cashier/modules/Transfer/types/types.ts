import { THooks } from '../../../../../types';
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

type TAction = {
    buttonLabel?: string;
    navigateTo?: string;
    openInNewTab?: boolean;
};

export type TMessage = {
    action?: TAction;
    text: string;
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
