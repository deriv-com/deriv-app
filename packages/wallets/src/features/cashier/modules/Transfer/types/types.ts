import { THooks } from '../../../../../types';
import type { TTransferContext } from '../provider';

export type TAccount = TTransferContext['activeWallet'];
export type TAccountsList = TTransferContext['accounts'];
export type TToAccount = TAccountsList[keyof TAccountsList][number] | undefined;

export type TInitialTransferFormValues = {
    activeAmountFieldName?: 'fromAmount' | 'toAmount';
    fromAccount?: TAccount;
    fromAmount: string;
    isError?: boolean;
    lastFocusedField?: 'fromAmount' | 'toAmount';
    toAccount?: TToAccount;
    toAmount: string;
};

type TAction = {
    buttonLabel?: JSX.Element;
    navigateTo?: string;
    shouldOpenInNewTab?: boolean;
};

export type TTransferMessage = {
    action?: TAction;
    message: JSX.Element;
    type: 'error' | 'info' | 'success' | 'warning';
};

export type TMessageFnProps = {
    USDExchangeRates?: THooks.ExchangeRate;
    activeWallet: THooks.ActiveWalletAccount;
    activeWalletExchangeRates?: THooks.ExchangeRate;
    displayMoney?: (amount: number, currency: string, fractionalDigits: number) => string;
    fiatAccount?: THooks.WalletAccountsList;
    limits?: THooks.AccountLimits;
    platformStatus?: string;
    sourceAccount: NonNullable<TAccount>;
    sourceAmount: number;
    targetAccount: TAccount;
    targetAmount: number;
};
