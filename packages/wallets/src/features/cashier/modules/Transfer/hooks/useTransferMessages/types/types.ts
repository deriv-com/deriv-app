import { THooks } from '../../../../../../../types';
import { TAccount } from '../../../types';

export type TMessage = {
    text: string;
    type: 'error' | 'success';
};

export type TMessageFnProps = {
    activeWallet: THooks.ActiveWalletAccount;
    displayMoney?: (amount: number, currency: string, fractionalDigits: number) => string;
    exchangeRates?: THooks.ExchangeRate;
    limits?: THooks.AccountLimits;
    sourceAccount: NonNullable<TAccount>;
    sourceAmount: number;
    targetAccount: NonNullable<TAccount>;
};
